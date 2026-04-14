import React from 'react'
import '../../src/styles/Termsandconditions.css'

export default function TermsAndConditions({ close }) {
    return (
        <div className='termsandcondition-container'>
            <h1 className='termsandcondition-head'>
                terms and conditions
            </h1>
            <p className='termsandcondition-note'>
                Welcome to our ECHO Chat Application.
                These Terms and Conditions govern your use of our platform, which provides instant messaging services using secure authentication and cloud-based data storage.
                <br />
                By accessing or using the application, you agree to these Terms.
            </p>
            <h1 className='termsandcondition-sub-head'>
                Use of the Service
            </h1>
            <span className='info'>This application allows users to:</span>
            <ul className='termsandcondition-terms'>
                <li>Create accounts and authenticate securely.</li>
                <li>Send and receive real-time messages.</li>
                <li>View chat history and user profiles.</li>
            </ul>
            <span className='info'>You agree to use the service only for lawful purposes.</span>
            <h1 className='termsandcondition-sub-head'>
                User Accounts & Authentication
            </h1>
            <ul className='termsandcondition-terms'>
                <li>You must provide accurate information during registration.</li>
                <li>Authentication is securely handled.</li>
                <li>You are responsible for all activities under your account.</li>
                <li>Do not share your login credentials with others.</li>
            </ul>
            <h1 className='termsandcondition-sub-head'>
                User Conduct
            </h1>
            <span className='info'>You agree NOT to:</span>
            <ul className='termsandcondition-terms'>
                <li>Send spam, abusive, hateful, or offensive messages.</li>
                <li>Share illegal, harmful, or misleading content.</li>
                <li>Impersonate other users.</li>
                <li>Attempt to hack, disrupt, or misuse the system.</li>
            </ul>
            <span className='info'>Violation may lead to account suspension or permanent ban.</span>
            <h1 className='termsandcondition-sub-head'>
                Messages & Data Storage
            </h1>
            <ul className='termsandcondition-terms'>
                <li>Messages are stored in a cloud database.</li>
                <li>While we implement security measures, we do not guarantee absolute security.</li>
                <li>You are responsible for the content you share.</li>
            </ul>
            <h1 className='termsandcondition-sub-head'>
                Real-Time Features
            </h1>
            <ul className='termsandcondition-terms'>
                <li>The application uses real-time updates for messaging and notifications.</li>
                <li>Temporary delays or failures may occur due to network or server issues.</li>
            </ul>
            <h1 className='termsandcondition-sub-head'>
                Account Termination
            </h1>
            <span className='info'>We reserve the right to:</span>
            <ul className='termsandcondition-terms'>
                <li>Suspend or delete accounts violating these Terms.</li>
                <li>Remove inappropriate messages or content.</li>
            </ul>
            <h1 className='termsandcondition-sub-head'>
                Limitation of Liability
            </h1>
            <span className='info'>We are not responsible for:</span>
            <ul className='termsandcondition-terms'>
                <li>Content shared by users.</li>
                <li>Data loss due to technical failures.</li>
                <li>Any damages resulting from misuse of the application.</li>
            </ul>
            <h1 className='termsandcondition-sub-head'>
                Intellectual Property
            </h1>
            <ul className='termsandcondition-terms'>
                <li>All application features, UI, and code are owned by the developers.</li>
                <li>You may not copy, modify, or distribute any part without permission.</li>
            </ul>
            <h1 className='termsandcondition-sub-head'>
                Changes to Terms
            </h1>
            <ul className='termsandcondition-terms'>
                <li>We may update these Terms at any time. Continued use of the app means you accept the updated Terms.</li>
            </ul>
            <h1 className='termsandcondition-sub-head'>
                Contact Us
            </h1>
            <ul className='termsandcondition-terms'>
                <li>For any questions or support</li>
                <li className='email'>Email : <a href="mailto:akhilprsnl@gmail.com">akhilprsnl@gmail.com</a></li>
            </ul>
            <div className='termsandcondition-footer'>
                <button type='button' className='continue' onClick={close}>continue</button>
            </div>
        </div>
    )
}
