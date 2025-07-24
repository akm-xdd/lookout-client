"use client";
import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Eye,
  Database,
  Mail,
  Clock,
  Globe,
  Lock,
} from "lucide-react";

// Layout Components
import Navbar from '@/app/_components/layout/Navbar'
import Footer from '@/app/_components/layout/Footer'
import AnimatedBackground from '@/app/_components/layout/AnimatedBackground'

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatedBackground particleCount={30} />
      
      <Navbar 
        onLoginClick={() => window.location.href = '/login'}
        onGetStartedClick={() => window.location.href = '/register'}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Title */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-full mb-6">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-gray-400 text-lg">Last updated: July 16, 2025</p>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <div className="space-y-8">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Eye className="w-6 h-6 mr-3 text-blue-400" />
                  Introduction
                </h2>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                  <p className="text-gray-300 leading-relaxed">
                    LookOut ("we," "our," or "us") is committed to protecting your
                    privacy. This Privacy Policy explains how we collect, use,
                    disclose, and safeguard your information when you use our
                    uptime monitoring service. By using LookOut, you agree to the
                    collection and use of information in accordance with this
                    policy. Please beware that this policy may change over time,
                    and we will notify you of any significant changes by posting
                    the new policy on this page with an updated "Last updated"
                    date. Additionally, we encourage you to review this Privacy
                    Policy periodically for any changes. If you do not agree with
                    the terms of this Privacy Policy, please do not access the
                    site.
                  </p>
                  <br />
                  <p className="text-gray-300 leading-relaxed">
                    We do not knowingly track or collect any personal information entered on our website. Any information you enter on the website for monitoring purposes is used solely for the functionality of the service and is not stored or processed for any other purpose. It is however advised to avoid entering sensitive personal information on the site, such as passwords, authentication tokens, or any other sensitive data that could compromise your security or privacy. You will be solely responsible for the information you provide, and we will not be liable for any issues arising from the use of such information. If you have any concerns about privacy or data security, please contact us before using the service.
                  </p>
                </div>
              </section>

              {/* Information We Collect */}
              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Database className="w-6 h-6 mr-3 text-blue-400" />
                  Information We Collect
                </h2>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-medium mb-2 text-white">
                        Personal Information
                      </h3>
                      <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>
                          Email address (for account creation and notifications)
                        </li>
                        <li>Password (securely hashed using bcrypt)</li>
                        <li>Account creation and last login timestamps</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-medium mb-2 text-white">
                        Service Data
                      </h3>
                      <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>Workspace names and descriptions you create</li>
                        <li>Endpoint URLs and monitoring configurations</li>
                        <li>
                          HTTP headers and request bodies for endpoints you
                          configure
                        </li>
                        <li>
                          Monitoring results including response times and status
                          codes
                        </li>
                        <li>Notification preferences (email, webhook URLs)</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-medium mb-2 text-white">
                        Technical Information
                      </h3>
                      <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>
                          IP addresses for security and authentication purposes
                        </li>
                        <li>Browser type and version (via user agent)</li>
                        <li>Device information for responsive design</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* How We Use Your Information */}
              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Globe className="w-6 h-6 mr-3 text-blue-400" />
                  How We Use Your Information
                </h2>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Provide and maintain our uptime monitoring service</li>
                  <li>
                    Monitor your configured endpoints according to your settings
                  </li>
                  <li>Send notifications about endpoint status changes</li>
                  <li>
                    Generate reports and analytics for your monitored services
                  </li>
                  <li>Authenticate and secure your account</li>
                  <li>Communicate with you about service updates or issues</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              {/* Data Storage and Security */}
              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Lock className="w-6 h-6 mr-3 text-blue-400" />
                  Data Storage and Security
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-300 leading-relaxed">
                    We implement industry-standard security measures to protect
                    your personal information:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>All data is encrypted in transit using HTTPS/TLS</li>
                    <li>Passwords are securely hashed using bcrypt</li>
                    <li>Database access is restricted and monitored</li>
                    <li>Regular security audits and updates</li>
                    <li>JWT tokens for secure authentication</li>
                    <li>Rate limiting to prevent abuse</li>
                  </ul>
                  <p className="text-gray-300 leading-relaxed">
                    Your data is stored on secure, managed cloud infrastructure
                    with automatic backups and redundancy.
                  </p>
                </div>
              </section>

              {/* Data Retention */}
              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Clock className="w-6 h-6 mr-3 text-blue-400" />
                  Data Retention
                </h2>
                <div className="space-y-4">
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>
                      <strong>Account Data:</strong> Retained until you delete
                      your account
                    </li>
                    <li>
                      <strong>Monitoring Results:</strong> Stored for 90 days by
                      default
                    </li>
                    <li>
                      <strong>Logs and Analytics:</strong> Retained for 30 days
                      for security and service improvement
                    </li>
                    <li>
                      <strong>Email Communications:</strong> Retained for 1 year
                      for support purposes
                    </li>
                  </ul>
                  <p className="text-gray-300 leading-relaxed">
                    When you delete your account, we will permanently delete
                    your personal data within 30 days, except where we are
                    required to retain it for legal compliance.
                  </p>
                </div>
              </section>

              {/* Third-Party Services */}
              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Mail className="w-6 h-6 mr-3 text-blue-400" />
                  Third-Party Services
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-300 leading-relaxed">
                    We use the following third-party services to provide our
                    functionality:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>
                      <strong>Email Service:</strong> For sending notifications
                      and account-related emails
                    </li>
                    <li>
                      <strong>Cloud Hosting:</strong> For reliable service
                      delivery and data storage
                    </li>

                  </ul>
                  <p className="text-gray-300 leading-relaxed">
                    These services are carefully selected and comply with
                    privacy standards. We do not share your personal information
                    with third parties except as necessary to provide our
                    service.
                  </p>
                </div>
              </section>

              {/* Your Rights */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
                <div className="space-y-4">
                  <p className="text-gray-300 leading-relaxed">
                    You have the following rights regarding your personal data:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>
                      <strong>Access:</strong> Request a copy of your personal
                      data
                    </li>
                    <li>
                      <strong>Correction:</strong> Update or correct inaccurate
                      information
                    </li>
                    <li>
                      <strong>Deletion:</strong> Request deletion of your
                      personal data
                    </li>
                    <li>
                      <strong>Portability:</strong> Export your data in a
                      machine-readable format
                    </li>
                    <li>
                      <strong>Objection:</strong> Object to processing of your
                      personal data
                    </li>
                    <li>
                      <strong>Restriction:</strong> Request limitation of data
                      processing
                    </li>
                  </ul>
                  <p className="text-gray-300 leading-relaxed">
                    To exercise these rights, please contact us using the
                    information provided below.
                  </p>
                </div>
              </section>

              {/* Cookies */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Cookies and Tracking
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-300 leading-relaxed">
                    We use minimal cookies and local storage to provide our
                    service:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>
                      <strong>Authentication Tokens:</strong> To keep you logged
                      in securely
                    </li>
                    <li>
                      <strong>Preferences:</strong> To remember your settings
                      and preferences
                    </li>
                  </ul>
                  <p className="text-gray-300 leading-relaxed">
                    You can disable cookies in your browser settings, but this
                    may limit the functionality of our service.
                  </p>
                </div>
              </section>

              {/* Updates to Policy */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Updates to This Policy
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the "Last updated" date. We encourage
                  you to review this Privacy Policy periodically for any
                  changes.
                </p>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <div className="space-y-4">
                  <p className="text-gray-300 leading-relaxed">
                    If you have any questions about this Privacy Policy or our
                    privacy practices, please contact us:
                  </p>
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                    <p className="text-gray-300">
                      <strong>Email:</strong> ctfu.anand@outlook.com
                    </p>
                    <p className="text-gray-300 mt-2">
                      <strong>Response Time:</strong> We will respond to privacy
                      inquiries within 48 hours.
                    </p>
                  </div>
                </div>
              </section>

              {/* Compliance */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Compliance</h2>
                <p className="text-gray-300 leading-relaxed">
                  This Privacy Policy is designed to comply with applicable
                  privacy laws including GDPR, CCPA, and other regional privacy
                  regulations. We are committed to protecting your privacy
                  rights regardless of your location.
                </p>
              </section>
            </div>
          </div>

          {/* Back to Top */}
          <div className="text-center mt-12 pt-8 border-t border-gray-800">
            <Link
              href="/"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
