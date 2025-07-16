// components/workspace/EndpointFormModal.tsx
import React, { useState } from 'react'
import { X, Plus, ChevronDown, Globe, Settings, Code, Timer, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { endpointAPI, APIError } from '@/lib/api-client'

interface EndpointFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  workspaceId: string
  maxEndpoints: number
  currentEndpoints: number
}

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'PATCH']
const STATUS_CODES = [200, 201, 204, 301, 302, 400, 401, 403, 404, 500]

const EndpointFormModal: React.FC<EndpointFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  workspaceId,
  maxEndpoints,
  currentEndpoints
}) => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    method: 'GET',
    headers: {} as Record<string, string>,
    body: '',
    expected_status: 200,
    frequency_minutes: 5,
    timeout_seconds: 30,
    is_active: true
  })

  const [headerInput, setHeaderInput] = useState({ key: '', value: '' })
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Endpoint name is required')
      return
    }

    if (!formData.url.trim()) {
      toast.error('URL is required')
      return
    }

    if (!formData.url.match(/^https?:\/\//)) {
      toast.error('URL must start with http:// or https://')
      return
    }

    if (currentEndpoints >= maxEndpoints) {
      toast.error(`Maximum ${maxEndpoints} endpoints per workspace`)
      return
    }

    setLoading(true)
    
    try {
      const endpointData = {
        ...formData,
        name: formData.name.trim(),
        url: formData.url.trim(),
        body: formData.body.trim() || undefined,
        headers: Object.keys(formData.headers).length > 0 ? formData.headers : undefined
      }

      await endpointAPI.createEndpoint(workspaceId, endpointData)
      
      toast.success('Endpoint created!', {
        description: `"${formData.name}" is now being monitored`,
        duration: 3000,
      })
      
      resetForm()
      onClose()
      onSuccess()
      
    } catch (error) {
      if (error instanceof APIError) {
        toast.error('Failed to create endpoint', {
          description: error.message,
          duration: 4000,
        })
      } else {
        toast.error('Unexpected error', {
          description: 'Please try again',
          duration: 4000,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      url: '',
      method: 'GET',
      headers: {},
      body: '',
      expected_status: 200,
      frequency_minutes: 5,
      timeout_seconds: 30,
      is_active: true
    })
    setHeaderInput({ key: '', value: '' })
    setShowAdvanced(false)
  }

  const handleClose = () => {
    if (!loading) {
      resetForm()
      onClose()
    }
  }

  const addHeader = () => {
    if (headerInput.key && headerInput.value) {
      setFormData(prev => ({
        ...prev,
        headers: {
          ...prev.headers,
          [headerInput.key]: headerInput.value
        }
      }))
      setHeaderInput({ key: '', value: '' })
    }
  }

  const removeHeader = (key: string) => {
    setFormData(prev => ({
      ...prev,
      headers: Object.fromEntries(
        Object.entries(prev.headers).filter(([k]) => k !== key)
      )
    }))
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-500/20 text-green-400'
      case 'POST': return 'bg-blue-500/20 text-blue-400'
      case 'PUT': return 'bg-yellow-500/20 text-yellow-400'
      case 'DELETE': return 'bg-red-500/20 text-red-400'
      case 'PATCH': return 'bg-purple-500/20 text-purple-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-black border border-white/20 rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-black border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold">Add Endpoint</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Endpoint Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., API Health Check, Login Endpoint"
                maxLength={100}
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-400 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                URL *
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://example.com/api/health"
                maxLength={500}
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-400 disabled:opacity-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  HTTP Method
                </label>
                <div className="relative">
                  <select
                    value={formData.method}
                    onChange={(e) => setFormData(prev => ({ ...prev, method: e.target.value }))}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white disabled:opacity-50 appearance-none"
                  >
                    {HTTP_METHODS.map(method => (
                      <option key={method} value={method} className="bg-black">
                        {method}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Expected Status
                </label>
                <div className="relative">
                  <select
                    value={formData.expected_status}
                    onChange={(e) => setFormData(prev => ({ ...prev, expected_status: parseInt(e.target.value) }))}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white disabled:opacity-50 appearance-none"
                  >
                    {STATUS_CODES.map(code => (
                      <option key={code} value={code} className="bg-black">
                        {code}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Settings Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Advanced Settings</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>

          {/* Advanced Settings */}
          {showAdvanced && (
            <div className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10">
              {/* Frequency & Timeout */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Check Frequency (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.frequency_minutes}
                    onChange={(e) => setFormData(prev => ({ ...prev, frequency_minutes: parseInt(e.target.value) }))}
                    min={1}
                    max={60}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Timeout (seconds)
                  </label>
                  <input
                    type="number"
                    value={formData.timeout_seconds}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeout_seconds: parseInt(e.target.value) }))}
                    min={5}
                    max={120}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Request Headers */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Request Headers
                </label>
                
                {/* Add Header Input */}
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={headerInput.key}
                    onChange={(e) => setHeaderInput(prev => ({ ...prev, key: e.target.value }))}
                    placeholder="Header name"
                    disabled={loading}
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-400 disabled:opacity-50"
                  />
                  <input
                    type="text"
                    value={headerInput.value}
                    onChange={(e) => setHeaderInput(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="Header value"
                    disabled={loading}
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-400 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={addHeader}
                    disabled={loading || !headerInput.key || !headerInput.value}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add
                  </button>
                </div>

                {/* Header List */}
                {Object.entries(formData.headers).length > 0 && (
                  <div className="space-y-2">
                    {Object.entries(formData.headers).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex-1">
                          <span className="font-medium text-white">{key}:</span>
                          <span className="text-gray-300 ml-2">{value}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeHeader(key)}
                          disabled={loading}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Request Body */}
              {(formData.method === 'POST' || formData.method === 'PUT' || formData.method === 'PATCH') && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Request Body
                  </label>
                  <textarea
                    value={formData.body}
                    onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                    placeholder="JSON, form data, or other request body..."
                    maxLength={10000}
                    rows={4}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-400 resize-none disabled:opacity-50 font-mono text-sm"
                  />
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <AlertCircle className="w-4 h-4" />
              <span>{currentEndpoints}/{maxEndpoints} endpoints used</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.name.trim() || !formData.url.trim() || currentEndpoints >= maxEndpoints}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Create Endpoint</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EndpointFormModal