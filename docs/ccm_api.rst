.. raw:: latex

   \mainpage

Cloud Connectivity Manager (CCM)
================================

AIROC™ Cloud Connectivity Manager(CCM) is a connectivity module that
adheres to `AWS IoT
Expresslink <https://aws.amazon.com/iot-expresslink>`__ specification.
The module is connected via serial interface (UART based) that uses an
abstracted Application Programming Interface (API) to connect any host
application to AWS IoT Core and its services. In so doing, an CCM module
is offloading complex and undifferentiated workload such as
authentication, device management, connectivity, and messaging from the
application (host) processor.

Supported kits
--------------

-  `AIROC™ Cloud Connectivity Manager module
   (IFW956810) <https://www.cypress.com/products/airoc-cloud-connectivity-manager>`__

Hardware setup
--------------

This example uses the board’s default configuration. See the kit user
guide `Getting started with AIROC™ IFW56810 Cloud Connectivity
Manager <https://www.infineon.com/AIROCIFW56810GSG>`__ to ensure that
the board is configured correctly. Before running the AIROC™ CCM
application, Register provisioned device certificate in the AWS portal
by following the registration steps provided in `Getting started with
AIROC™ IFW56810 Cloud Connectivity
Manager <https://www.infineon.com/AIROCIFW56810GSG>`__ .

Software setup
--------------

Install a terminal emulator if you don’t have one. Instructions in this
document use `Tera Term <https://ttssh2.osdn.jp/index.html.en>`__.

Entering AIROC™ CCM AT commands
-------------------------------

AIROC™ CCM module supports execution of `AWS IoT
Expresslink <https://aws.amazon.com/iot-expresslink>`__ AT commands
through USB serial device COM port. The user can enter the commands a
line at a time by typing, or by pasting the command in the serial window
and pressing **Enter**.

The list of AT commands supported by AIROC™ CCM module is available
`here <\ref%20airoc_ccm_at_commands>`__.

Refer `AIROC™ CCM module Sample command
sequences <\ref%20airoc_ccm_at_command_sequence>`__ for sample AT
command sequence to communicate with AWS IoT cloud.

Wi-Fi onboarding
----------------

AIROC™ CCM module supports Wi-Fi SoftAP onboarding. To enable this
feature user is expected to use *CONFMODE* command as described in `AWS
IoT ExpressLink Programmers
Manual <https://docs.aws.amazon.com/expresslink>`__. After enabling
Wi-Fi SoftAP onboarding, user needs to use *Cirrent Wi-Fi Onboarding*
mobile app to onboard the AIROC™ CCM module. To evaluate this feature,
download the *Cirrent Wi-Fi Onboarding* mobile app which is available
for
`iOS <https://apps.apple.com/us/developer/cirrent-inc/id999550381>`__
and
`Android <https://play.google.com/store/apps/developer?id=Cirrent+Inc&hl=en_US&gl=US>`__.

1. Start the *Cirrent Wi-Fi Onboarding* mobile app.

2. Follow the instructions on the mobile app to send Wi-Fi credentials
   to the CCM module.

3. If the device certificate is registered with AWS IoT and EndPoint is
   configured in CCM module, then post Wi-Fi onboarding CCM module will
   connect to AWS IoT.

**NOTE** The Wi-Fi credentials from the onboarding process are stored by
the CCM module and will be used to connect to the network every time the
CCM boots.
