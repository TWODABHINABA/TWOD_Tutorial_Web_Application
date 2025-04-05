import CustomNavbar from '../../components/navbar/Navbar';
import Foote from '../../components/footer/Footer';
import { Link } from 'react-router-dom';
import "./privacyPolicy.css"
const styles = {
    base: {
      fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      fontSize: '1.2rem'
    },
    h1: {
      color: 'rgb(255 90 31)'
    },
    h2: {
      fontSize: '1.5em',
      color: 'rgb(255 90 31)'
    }
  };
const privacyPolicy = () => {

    return (
        <div style={styles.base} className='w-full'>
            <CustomNavbar />
            <br></br>
            <div className="container mx-auto p-6">
                <h1 style={styles.h1} className="text-3xl font-bold">Privacy Policy</h1>
                <p className="mt-4 text-gray-700">
                    Welcome to **Tutor**. Your privacy is important to us. Tx   his Privacy Policy explains how we collect, use, and protect your personal information when you use our platform to book and attend tutoring sessions.
                </p>
            </div>
            <br></br>
            <div className="container mx-auto p-6">

                <h2 style={styles.h2} className="font-semibold">Information We Collect</h2>
                <p className="text-gray-700 mt-2">
                    When you use <b>**Tutor**</b>, we collect different types of information to provide a seamless and secure experience.
                </p>

                {/* Personal Information */}
                <h3 className="text-xl font-medium mt-4">Personal Information</h3>
                <p className="text-gray-700 mt-2">
                    When you sign up, book a tutor, or interact with our services, we may collect:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                    <li>Your **full name**</li>
                    <li>Your **email address**</li>
                    <li>Your **phone number**</li>
                    <li>Your **profile photo** (optional)</li>
                </ul>

                {/* Payment Information */}
                <h3 className="text-xl font-medium mt-4">Payment Information</h3>
                <p className="text-gray-700 mt-2">
                    If you make a booking, we collect payment details, such as:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                    <li>Billing name and address</li>
                    <li>Payment method details (processed securely via third-party services like Stripe or PayPal)</li>
                </ul>

                {/* Usage Data */}
                <h3 className="text-xl font-medium mt-4">Usage Data</h3>
                <p className="text-gray-700 mt-2">
                    We automatically collect certain technical data when you interact with our website:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                    <li>IP address and device information</li>
                    <li>Browser type and version</li>
                    <li>Pages visited and interaction time</li>
                </ul>

                {/* Cookies and Tracking */}
                <h3 className="text-xl font-medium mt-4">Cookies and Tracking Technologies</h3>
                <p className="text-gray-700 mt-2">
                    We use cookies to enhance your experience, remember your preferences, and analyze website traffic.
                </p>
                <p className="text-gray-700 mt-2">
                    You can manage your cookie settings in your browser preferences.
                </p>
            </div>

            <br></br>
            <br></br>
            <br></br>


            <div className="container mx-auto p-6">
                <h2 style={styles.h2} className="font-semibold">How We Use Your Information</h2>
                <p className="text-gray-700 mt-2">
                    We collect your information to provide a seamless learning experience, improve our platform, and ensure secure transactions. Below are the primary ways we use your data:
                </p>

                {/* Providing and Managing Services */}
                <h3 className="text-xl font-medium mt-4">Providing and Managing Our Services</h3>
                <p className="text-gray-700 mt-2">
                    We use your data to:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                    <li>Allow you to create an account and manage your profile.</li>
                    <li>Enable booking and attending tutoring sessions.</li>
                    <li>Match students with the most suitable tutors.</li>
                    <li>Facilitate communication between students and tutors.</li>
                </ul>

                {/* Payment Processing */}
                <h3 className="text-xl font-medium mt-4">Payment Processing</h3>
                <p className="text-gray-700 mt-2">
                    We use your payment details to securely process transactions for tutoring sessions. Payments are handled by trusted third-party providers such as **Stripe** or **PayPal**.
                </p>

                {/* Personalization and Experience Improvement */}
                <h3 className="text-xl font-medium mt-4">Personalization and Experience Improvement</h3>
                <p className="text-gray-700 mt-2">
                    We analyze your usage data to:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                    <li>Recommend tutors based on your interests and past bookings.</li>
                    <li>Optimize website performance and user experience.</li>
                    <li>Provide customer support and respond to inquiries.</li>
                </ul>

                {/* Communication and Notifications */}
                <h3 className="text-xl font-medium mt-4">Communication and Notifications</h3>
                <p className="text-gray-700 mt-2">
                    We may send you:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                    <li>Booking confirmations and reminders.</li>
                    <li>Updates about new features and platform improvements.</li>
                    <li>Marketing emails (which you can opt out of anytime).</li>
                </ul>

                {/* Legal and Security Compliance */}
                <h3 className="text-xl font-medium mt-4">Legal and Security Compliance</h3>
                <p className="text-gray-700 mt-2">
                    We may use your data to comply with legal obligations, prevent fraud, and enhance platform security.
                </p>
            </div>

            <br></br>
            <br></br>
            <br></br>

            <div className="container mx-auto p-6">
                <h2 style={styles.h2} className="font-semibold">Sharing Your Information</h2>
                <p className="text-gray-700 mt-2">
                    We value your privacy and do not sell your personal data. However, we may share your information in the following circumstances:
                </p>

                {/* With Tutors */}
                <h3 className="text-xl font-medium mt-4">With Tutors</h3>
                <p className="text-gray-700 mt-2">
                    When you book a class, your relevant details (such as name and contact information) may be shared with the tutor to facilitate the session.
                </p>

                {/* With Payment Processors */}
                <h3 className="text-xl font-medium mt-4">With Payment Processors</h3>
                <p className="text-gray-700 mt-2">
                    To process payments securely, we share necessary details with third-party payment providers such as **Stripe** or **PayPal**. We do not store your payment details.
                </p>

                {/* With Service Providers */}
                <h3 className="text-xl font-medium mt-4">With Service Providers</h3>
                <p className="text-gray-700 mt-2">
                    We may use trusted third-party service providers for hosting, analytics, and customer support. These providers are bound by confidentiality agreements.
                </p>

                {/* For Legal Compliance */}
                <h3 className="text-xl font-medium mt-4">For Legal Compliance</h3>
                <p className="text-gray-700 mt-2">
                    We may disclose your information if required by law or to protect our rights, prevent fraud, or ensure platform security.
                </p>

                {/* In Case of Business Transfers */}
                <h3 className="text-xl font-medium mt-4">In Case of Business Transfers</h3>
                <p className="text-gray-700 mt-2">
                    If **Tutor** is involved in a merger, acquisition, or sale, your data may be transferred as part of the business assets.
                </p>

                {/* Your Control Over Data Sharing */}
                <h3 className="text-xl font-medium mt-4">Your Control Over Data Sharing</h3>
                <p className="text-gray-700 mt-2">
                    You can manage your privacy settings and control what information you share through your account settings.
                </p>
            </div>
            <br></br>
            <br></br>
            <br></br>
            <div className="container mx-auto p-6">
                <h2 style={styles.h2} className="font-semibold">Children&apos;s Privacy</h2>
                <p className="text-gray-700 mt-2">
                    Protecting children&apos;s privacy is important to us. Our platform is not intended for children under the age of 13, and we do not knowingly collect personal data from them.
                </p>

                {/* Parental Consent */}
                <h3 className="text-xl font-medium mt-4">Parental Consent</h3>
                <p className="text-gray-700 mt-2">
                    If a child under 13 wishes to use our services, parental consent is required. Parents can review and manage their child&apos;s data at any time.
                </p>

                {/* Information Collection */}
                <h3 className="text-xl font-medium mt-4">Information Collection</h3>
                <p className="text-gray-700 mt-2">
                    We may collect limited personal information from children, but only with verified parental consent, in compliance with COPPA or similar regulations.
                </p>

                {/* How We Use Children's Data */}
                <h3 className="text-xl font-medium mt-4">How We Use Children&apos;s Data</h3>
                <p className="text-gray-700 mt-2">
                    Any collected information is used solely for educational purposes, improving our services, and ensuring a safe learning environment.
                </p>

                {/* Parental Rights */}
                <h3 className="text-xl font-medium mt-4">Parental Rights</h3>
                <p className="text-gray-700 mt-2">
                    Parents can request access, deletion, or modification of their child’s data by contacting our support team.
                </p>

                {/* Policy Updates */}
                <h3 className="text-xl font-medium mt-4">Policy Updates</h3>
                <p className="text-gray-700 mt-2">
                    If we make significant changes to how we handle children&apos;s data, we will notify parents and update our policies accordingly.
                </p>
            </div>


            <br></br><br></br><br></br>

            <div className="container mx-auto p-6">
                <h2 style={styles.h2} className="font-semibold">Parental Control & Consent</h2>
                <p className="text-gray-700 mt-2">
                    We recognize the importance of parental control in managing children&apos;s online activities. Parents have full control over their child&apos;s access to our platform.
                </p>

                {/* Account Supervision */}
                <h3 className="text-xl font-medium mt-4">Account Supervision</h3>
                <p className="text-gray-700 mt-2">
                    Parents or guardians must approve and manage their child&apos;s account to ensure compliance with our privacy policies.
                </p>

                {/* Reviewing & Modifying Data */}
                <h3 className="text-xl font-medium mt-4">Reviewing & Modifying Data</h3>
                <p className="text-gray-700 mt-2">
                    Parents can request access, correction, or deletion of their child’s personal information at any time.
                </p>

                {/* Revoking Consent */}
                <h3 className="text-xl font-medium mt-4">Revoking Consent</h3>
                <p className="text-gray-700 mt-2">
                    If a parent wishes to revoke consent for their child&apos;s data usage, they may contact us, and we will take appropriate actions.
                </p>

                {/* Safe Learning Environment */}
                <h3 className="text-xl font-medium mt-4">Safe Learning Environment</h3>
                <p className="text-gray-700 mt-2">
                    We implement strict policies to ensure children have a safe and educational experience on our platform.
                </p>

                {/* Contacting Us */}
                <h3 className="text-xl font-medium mt-4">Contacting Us</h3>
                <p className="text-gray-700 mt-2">
                    For any parental concerns regarding privacy, please reach out to our support team at <strong>support@tutor.com</strong>.
                </p>
            </div>


            <br></br><br></br><br></br>

            <div className="container mx-auto p-6">
                <h2 style={styles.h2} className="font-semibold">Data Security</h2>
                <p className="text-gray-700 mt-2">
                    We implement strict security measures to protect your personal information from unauthorized access, alteration, or disclosure.
                </p>

                {/* Encryption & Secure Storage */}
                <h3 className="text-xl font-medium mt-4">Encryption & Secure Storage</h3>
                <p className="text-gray-700 mt-2">
                    All sensitive data is encrypted during transmission and securely stored using industry-standard protocols.
                </p>

                {/* Access Controls */}
                <h3 className="text-xl font-medium mt-4">Access Controls</h3>
                <p className="text-gray-700 mt-2">
                    Only authorized personnel have access to your personal information, and they are required to follow strict confidentiality policies.
                </p>

                {/* Protection Against Unauthorized Use */}
                <h3 className="text-xl font-medium mt-4">Protection Against Unauthorized Use</h3>
                <p className="text-gray-700 mt-2">
                    We continuously monitor for security vulnerabilities and apply patches and updates to safeguard your data.
                </p>

                {/* User Responsibility */}
                <h3 className="text-xl font-medium mt-4">User Responsibility</h3>
                <p className="text-gray-700 mt-2">
                    While we take necessary precautions, users should also take steps to protect their accounts by using strong passwords and enabling two-factor authentication.
                </p>

                {/* Reporting Security Issues */}
                <h3 className="text-xl font-medium mt-4">Reporting Security Issues</h3>
                <p className="text-gray-700 mt-2">
                    If you suspect any unauthorized access or security breach, please notify us immediately at <strong>security@tutor.com</strong>.
                </p>
            </div>


            <br></br><br></br><br></br>

            <div className="container mx-auto p-6">
                <h2 style={styles.h2} className="font-semibold">Your Rights & Choices</h2>
                <p className="text-gray-700 mt-2">
                    You have rights over your personal data and choices regarding how we collect, use, and share your information.
                </p>

                {/* Accessing & Updating Information */}
                <h3 className="text-xl font-medium mt-4">Accessing & Updating Information</h3>
                <p className="text-gray-700 mt-2">
                    You can review and update your personal information through your account settings. If you need assistance, contact us.
                </p>

                {/* Data Deletion Requests */}
                <h3 className="text-xl font-medium mt-4">Data Deletion Requests</h3>
                <p className="text-gray-700 mt-2">
                    You may request the deletion of your personal data. Some information may be retained for legal or security purposes.
                </p>

                {/* Opting Out of Communications */}
                <h3 className="text-xl font-medium mt-4">Opting Out of Communications</h3>
                <p className="text-gray-700 mt-2">
                    You can unsubscribe from marketing emails at any time by clicking the &quot;Unsubscribe&quot; link or updating your preferences.
                </p>

                {/* Restricting Data Processing */}
                <h3 className="text-xl font-medium mt-4">Restricting Data Processing</h3>
                <p className="text-gray-700 mt-2">
                    You have the right to restrict or object to certain data processing activities, including personalized ads and analytics tracking.
                </p>

                {/* Requesting a Copy of Your Data */}
                <h3 className="text-xl font-medium mt-4">Requesting a Copy of Your Data</h3>
                <p className="text-gray-700 mt-2">
                    You can request a copy of your personal data in a structured, electronic format.
                </p>

                {/* Contacting Us */}
                <h3 className="text-xl font-medium mt-4">Contacting Us</h3>
                <p className="text-gray-700 mt-2">
                    If you wish to exercise any of these rights, please contact us at <strong>privacy@tutor.com</strong>.
                </p>
            </div>



            <br></br><br></br><br></br>



            <div className="container mx-auto p-6">
                <h2 className="font-semibold mt-6">Changes to This Policy</h2>
                <p className="text-gray-700 mt-2">
                    We may update this Privacy Policy from time to time. Any changes will be posted on this page.
                </p>
            </div>

            <br></br><br></br><br></br>

            <div className="container mx-auto p-6">
                <h2 className="font-semibold mt-6">Contact Us</h2>

                <Link to="/contact" className="text-blue-700 hover:underline" >

                    <span>&#9742;</span>
                    Contact us
                </Link>

                <p className="text-gray-700 mt-2">
                    If you have any questions, write to us at <strong>support@tutor.com</strong>.
                </p>
            </div>

            <br></br>


            <Foote />
        </div>
    )
}
export default privacyPolicy;