define([
    "underscore",
    "react",
    'react-dom',
], function(_, React, ReactDOM) {
    return React.createClass({
        getInitialState: function(){
            return {

            }
        },
        render: function() {
            var boldStyle = {
                fontWeight: 'bold',
            };
            return(
                <div>
                    <h3>
                        Librarebook Policy
                    </h3>
                    <p>As a non-profit service that provides books we hope to provide books to the public free of charge. The
                        purpose of copyright is to "promote the Progress of Science and useful Arts". Our goal is to
                        educate the masses and bring books in digital formats to our registered users in an effort to
                        preserve and encourage creativity. We believe that books should be available for everyone to read
                        and education is a right for all.
                    </p>
                    <h4>
                        Ownership of Copyright
                    </h4>
                    <p>
                        All rights reserved. No part of any publications may be reproduced, distributed, or
                        transmitted in any form or by any means, including photocopying, recording, or other
                        electronic or mechanical methods, without the prior written permission of the publisher,
                        except in the case of brief quotations embodied in critical reviews and certain other
                        noncommercial uses permitted by copyright law. For permission requests, write to the
                        publisher, addressed “Attention: Permissions Coordinator,” at the address below. By
                        creating an account and/or using our service, you are agreeing to these terms and conditions
                        as well as the copyright laws.Downloading or buying a book from Librarebook or any affiliated
                        sites does not give one the ability to reproduce, distribute, or transmit this or any resource
                        on this site.
                    </p>
                    <p>
                        Librarebook grants registered users the ability to download and view books from our publishers.
                        All rights to the books on our website are reserved to the publishers and the authors. Guidelines
                        do not always determine the entire breadth and scope of fair use protection. Fair use is to be
                        determined on a case to case situation.
                    </p>
                    <p>
                        Failure for any registered user of obeying our or any copyright policies may be punishable by
                        law. This will be decided on a case by case basis. Registered users who fail to obey our policies,
                        who distribute our resources without consent, keep any resources past the return date, etc.
                        will have their account banned including any further actions.
                    </p>
                    <h3>Terms and Conditions</h3>
                    <p>Last updated: May 01, 2016</p>
                    <p>
                        Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully before
                        using the http://www.librarebook.com website (the "Service") operated by librarebook ("us", "we", or "our").
                    </p>
                    <p>
                        Your access to and use of the Service is conditioned on your acceptance of and compliance
                        with these Terms. These Terms apply to all visitors, users and others who access or use the Service.
                    </p>
                    <p>
                        By accessing or using the Service you agree to be bound by these Terms. If you disagree with
                        any part of the terms then you may not access the Service.
                    </p>
                    <p style={boldStyle}>Accounts</p>
                    <p>
                        When you create an account with us, you must provide us information that is accurate,
                        complete, and current at all times. Failure to do so constitutes a breach of the Terms,
                        which may result in immediate termination of your account on our Service.
                    </p>
                    <p>
                        You are responsible for safeguarding the password that you use to access the Service and for
                        any activities or actions under your password, whether your password is with our Service or a third-party service.
                    </p>
                    <p>
                        You agree not to disclose your password to any third party. You must notify us immediately
                        upon becoming aware of any breach of security or unauthorized use of your account.
                    </p>
                    <p style={boldStyle}>Links To Other Web Sites</p>
                    <p>
                        Our Service may contain links to third-party web sites or services that are not owned or controlled by librarebook.
                    </p>
                    <p>
                        librarebook has no control over, and assumes no responsibility for, the content, privacy
                        policies, or practices of any third party web sites or services. You further acknowledge and
                        agree that librarebook shall not be responsible or liable, directly or indirectly, for any
                        damage or loss caused or alleged to be caused by or in connection with use of or reliance on
                        any such content, goods or services available on or through any such web sites or services.
                    </p>
                    <p>
                        We strongly advise you to read the terms and conditions and privacy policies of any
                        third-party web sites or services that you visit.
                    </p>
                    <p style={boldStyle}>Termination</p>
                    <p>
                        We may terminate or suspend access to our Service immediately, without prior notice or
                        liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>
                    <p>
                        All provisions of the Terms which by their nature should survive termination shall survive
                        termination, including, without limitation, ownership provisions, warranty disclaimers,
                        indemnity and limitations of liability.
                    </p>
                    <p>
                        We may terminate or suspend your account immediately, without prior notice or liability, for
                        any reason whatsoever, including without limitation if you breach the Terms.
                    </p>
                    <p>
                        Upon termination, your right to use the Service will immediately cease. If you wish to
                        terminate your account, you may simply discontinue using the Service.
                    </p>
                    <p>
                        All provisions of the Terms which by their nature should survive termination shall survive
                        termination, including, without limitation, ownership provisions, warranty disclaimers,
                        indemnity and limitations of liability.
                    </p>
                    <p style={boldStyle}>Governing Law</p>
                    <p>These Terms shall be governed and construed in accordance with the laws of New York, United
                        States, without regard to its conflict of law provisions.
                    </p>
                    <p>Our failure to enforce any right or provision of these Terms will not be considered a waiver
                        of those rights. If any provision of these Terms is held to be invalid or unenforceable by a
                        court, the remaining provisions of these Terms will remain in effect. These Terms constitute
                        the entire agreement between us regarding our Service, and supersede and replace any prior
                        agreements we might have between us regarding the Service.
                    </p>
                    <p style={boldStyle}>Changes</p>
                    <p>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                        If a revision is material we will try to provide at least 30 days notice prior to any new
                        terms taking effect. What constitutes a material change will be determined at our sole discretion.
                    </p>
                    <p>
                        By continuing to access or use our Service after those revisions become effective, you agree
                        to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
                    </p>
                    <p style={boldStyle}>Contact Us</p>
                    <p>
                        If you have any questions about these Terms, please contact us.
                    </p>
                </div>
            )
        }
    });
})
