import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                By accessing and using Invoify ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.
              </p>
              <p className="text-gray-700 leading-relaxed">
                These Terms constitute a legally binding agreement between you and Invoify.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Invoify is an online invoicing platform that allows users to create, manage, and send professional invoices. Our Service includes:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-4 ml-6">
                <li>Invoice creation and management tools</li>
                <li>Client relationship management</li>
                <li>Analytics and reporting features</li>
                <li>PDF generation and email delivery</li>
                <li>Payment tracking and status updates</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Account Creation</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                To use our Service, you must create an account by providing accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Account Responsibilities</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-4 ml-6">
                <li>Provide accurate and current information</li>
                <li>Maintain the security of your password</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Use the Service only for lawful purposes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-4 ml-6">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit harmful or malicious code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use the Service for fraudulent or illegal activities</li>
                <li>Create false or misleading invoices</li>
                <li>Interfere with or disrupt the Service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Subscription and Billing</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Subscription Plans</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We offer various subscription plans with different features and limitations. Plan details, including pricing and features, are available on our website and may change from time to time.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Billing and Payment</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Subscription fees are billed in advance on a recurring basis (monthly or annually, depending on your plan). You authorize us to charge your payment method for all fees incurred.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.3 Plan Changes</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may upgrade or downgrade your subscription at any time. Changes take effect at the next billing cycle. Downgrades may result in loss of access to certain features.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.4 Refunds</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We offer a 30-day money-back guarantee for new subscriptions. Refund requests must be made within 30 days of the initial charge. After this period, all payments are non-refundable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Our Content</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Service and its original content, features, and functionality are owned by Invoify and are protected by copyright, trademark, and other intellectual property laws.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2 User Content</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You retain ownership of the content you create using our Service (such as invoices and client data). By using our Service, you grant us a limited license to store, process, and display your content as necessary to provide the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Privacy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using our Service, you consent to our collection and use of information as outlined in our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Service Availability</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">8.1 Service Levels</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We strive to provide high availability for our Service but do not guarantee uninterrupted access. The Service may be temporarily unavailable due to maintenance, updates, or unforeseen circumstances.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">8.2 Modifications</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to modify, suspend, or discontinue any part of the Service at any time. We will provide reasonable notice for significant changes that affect your use of the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To the maximum extent permitted by law, Invoify shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service. Our total liability shall not exceed the amount paid by you for the Service in the 12 months preceding the claim.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree to indemnify and hold Invoify harmless from any claims, damages, losses, or expenses arising from your use of the Service, violation of these Terms, or infringement of any rights of another party.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">11.1 Termination by User</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may terminate your account at any time through your account settings or by contacting us.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">11.2 Termination by Us</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may terminate or suspend your account immediately for violations of these Terms or for other reasons we deem necessary to protect our Service or users.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">11.3 Effect of Termination</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Upon termination, your right to use the Service ceases immediately. We may delete your account and data after a reasonable period following termination.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions. Any disputes arising from these Terms shall be resolved in the courts of [Your Jurisdiction].
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of material changes via email or through our Service. Continued use of the Service after changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> legal@invoify.com</p>
                <p className="text-gray-700"><strong>Address:</strong> 123 Business Street, Suite 100, Business City, BC 12345</p>
                <p className="text-gray-700"><strong>Phone:</strong> (555) 123-4567</p>
              </div>
            </section>

            <section className="border-t pt-8 mt-12">
              <p className="text-sm text-gray-600">
                <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                By using Invoify, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
