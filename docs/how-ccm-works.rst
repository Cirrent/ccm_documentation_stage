How CCM works
===============

AIROC™ Cloud Connectivity Manager (CCM) simplifies the process that a Product Company follows to develop an IoT product that can securely and effortlessly be connected to a Product Cloud by end users in the field. CCM achieves this by incorporating the following four key IoT features in a single module:

1. Industry-leading Wi-Fi communications including SoftAP onboarding to help customers easily connect to their local Wi-Fi
2. A standardized AT command set compatible with AWS IoT ExpressLink 
3. Device authentication, provisioning, and security
4. Cloud device monitoring

Simply by including a CCM module within their product, developers can benefit from all of the above features in one go. Furthermore, every CCM module is shipped with a unique X.509 device certificate. This secure, unspoofable, device certificate is built into the CCM Module and can be used by the host to uniquely identify it in the field for use cases like ownership binding, firmware updates and to bypass any Access Controls on the product cloud.

CCM device certificates are pre-populated in CIRRENT™ Cloud ID which means that, on power-on, products can securely and automatically authenticate simply by presenting the device certificate to the product cloud and using it to set up the Thing configuration in AWS upon power up. 

The benefits of using a CCM module during product development and roll-out includes:

* Infineon has a long history (through Cypress Semiconductor) of providing a robust Wi-Fi solutions to the market.  These solutions come with a BLE based or Soft AP to help smooth out the process of on-boarding process at customer sites, and helps remove a key friction in getting your IoT devices onboarded and a precursor to revenue

* Allows developers to develop products that use simple AT commands such as “connect” and “send” to connect and streams data to their Product Cloud and to do so within hours, not weeks without having to develop and maintain software


* Enables original equipment manufacturers (OEMs) to easily transform products into IoT devices without the need for a deep understanding of the communications and security implementation and without merging large amounts of code,


* Offers the flexibility to connect various models of devices to a Product Cloud, while preserving the original application software and avoiding costly redesign


* Software upgradable via over-the-air (OTA) upgrades of the CCM solution using only IFX signed code along with support for host OTA upgrades to ensure security and future proofing.


* CCM includes support for the CIRRENT™ Cloud ID, which ensures that each device has a unique device identity and assignment to a product company stored in a secure hardware element to ensure a fail-proof mechanism.


* Maintains fleet security and health at scale by providing an out-of-the-box solution that securely transmits data to and from the cloud via Wi-Fi, including online device monitoring.


Hardware Description
*********************

The AIROC™ IFW56810 module with integrated antenna provides everything needed to connect a host processor to the cloud. Pre-certified for FCC, CE, Canada, Japan, Taiwan, Australia, and New Zealand, this module requires no extra RF or clocking circuitry. With just five host interface signals plus power and ground, connection to a host using an industry-standard UART is straightforward. IEEE 802.11n single band 2.4 GHz Wi-Fi performance is based on the industry’s most widely deployed IoT technology from Infineon®. Bluetooth® LE onboarding to Wi-Fi networks is also supported.
 
.. image:: img/hw-1.png
	    :align: center

Physical characteristics
^^^^^^^^^^^^^^^^^^^^^^^^^

=======================   ====================================================
Features                  Description 
-----------------------   ----------------------------------------------------
Product description       IEEE 802.11 b/g/n wireless LAN and Bluetooth® IoT module
Host interface            UART
Dimension                 36.0mm(L) x 18mm(W) x 2.8mm(H)
Form factor               LGA module, 146p
Antenna                   Internal PCB antenna
Weight                    2.3g
=======================   ====================================================

Operating conditions
^^^^^^^^^^^^^^^^^^^^^

==================================   ===============================================================

----------------------------------   ---------------------------------------------------------------
Voltage                              VBAT: 3.2V~4.8V (3.6V typical); VDD: 1.7V~3.6V
Operating temperature                -30°C to 85°C (optimal RF performance guarantee -30°C to 80°C)
Operating humidity                   less than 85% R.H.
Storage temperature -40°C to 90°C    -40°C to 90°C 
Storage humidity                     less than 60% R.H.
==================================   ===============================================================



Hardware integration
^^^^^^^^^^^^^^^^^^^^^


Wireless Features
"""""""""""""""""

Every CCM module includes industry-leading INFINEON Wi-Fi technology for long range, robust connectivity. CCM modules support:

* Wi-Fi 4 (802.11n)
* Up to 96Mbps PHY data rate
* Integrated Antenna
* Soft AP or BLE Wi-Fi onboarding
* Certified for US, Canada, EU, Japan, Taiwan, Australia, New Zealand
* On-module flash memory to store second FW image for safe over-the-air updates

Software description
"""""""""""""""""""""

* Cloud Management Features
* AWS IoT Express Link compatible
* Supports over-the-air updates
* Networking Features include:
* Full network stack offload from host: TCP/IP, TLS, DNS, HTTP, and MQTT
* Fully documented command set for simple configuration from host processor


Datasheet and Quick Start Guide
""""""""""""""""""""""""""""""""

Post links to datasheet and guide for kit
