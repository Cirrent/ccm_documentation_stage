CIRRENT™ Services
==================

AIROC™ CCM modules enable effortless and secure device authentication and provisioning thanks to CIRRENT™ Cloud ID, part of the INFINEON portfolio of products. CCM modules also benefit from built-in device monitoring thanks to CIRRENT™ INI. In this section we briefly discuss how your CCM-equipped products interact with CIRRENT™ services.

Registering for an Infineon Account
************************************

Before you can start to use CCM modules you must first `register an INFINEON account <https://cirrent.infineon.com/login>`_. Registration is free and `you can do so via this link <https://cirrent.infineon.com/login>`_. Registering automatically creates a user profile in the CIRRENT™ Cloud, and gives you full access to CIRRENT™ Console. 

Each INFINEON account can have multiple users assigned to it. You can learn more about managing users in the `CIRRENT™ Console here <https://documentation.infineon.com/html/cirrent-support-documentation/en/latest/cirrent-console.html>`_.

CIRRENT™ Cloud ID
******************

`CIRRENT™ Cloud ID <https://documentation.infineon.com/html/cirrent-support-documentation/en/latest/cirrent-could-id.html>`_ is designed to solve many of the device authentication difficulties associated with hardware security modules (HSMs), while avoiding the security risks of software-only alternatives.

Cloud ID works by including a secure, unique, unspoofable device identity in the AIROC™ CCM module that you install in your product. CCM modules have a unique X.509 device certificate built in at Infineon’s manufacturing facility.

CIRRENT™ Cloud ID is pre-populated with the device certificates for CCM modules. During the manufacturing process you install CCM modules in your products. As soon as your customer connects your product to the internet, the product connects to Cloud ID to authenticate itself, Cloud ID then securely informs your Product Cloud that your product should be admitted. 

Your can read more about how Cloud ID works `here <https://documentation.infineon.com/html/cirrent-support-documentation/en/latest/cirrent-could-id.html>`_.

Managing API endpoints and devices in Cloud ID
*************************************************

The CIRRENT™ Console is the web app that you use to make use of CIRRENT™ Cloud ID services. To provision devices using an API you need to first set up a link to your Product Cloud by configuring a cloud API in the CIRRENT™ Console. We provide simplified instructions covering AWS here, and you can read more about configuring and editing API endpoints in the CIRRENT™ documentation.

The CIRRENT™ Console also includes the ability to manage any CCM-enabled products that were provisioned into your Product Cloud via Cloud ID. You can read more about managing devices provisioned in Cloud ID in the CIRRENT™ Cloud ID documentation.


CIRRENT™ INI
**************

`CIRRENT™ IoT Network Intelligence (INI) <https://documentation.infineon.com/html/cirrent-support-documentation/en/latest/cirrent-ini.html>`_ delivers IoT device analytics for IoT devices at home and for IoT devices in industry. INI helps you to drive product development to improve the user experience – which leads to better product reviews, fewer returns, and increased sales.

AIROC™ CCM modules include the CIRRENT™ Agent which collects on-device data that’s stored in the CIRRENT™ Cloud for analysis by CIRRENT™ INI.

Some of the benefits of accessing INI data includes deep insight into how your devices behave in the field, and how users make use of your devices every day. Using INI you can gain deep insight into customer environments to identify and prioritize your customer’s pain points and solve issues faster. 

INI can also help optimize product performance through actionable data, including real-world performance analytics pre and post product launch. That includes product lifecycle data such as wireless performance, ensuring your pre-production testing algins with performance in the real world.
Read more about accessing and analyzing INI data for your CCM-enabled products by reading the INI user guide `here <https://documentation.infineon.com/html/cirrent-support-documentation/en/latest/cirrent-ini.html>`_.