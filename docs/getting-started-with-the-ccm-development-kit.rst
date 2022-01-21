Getting Started With the CCM Development Kit
==============================================


Kit Contents
**************

The IFW956810 CCM evaluation kit consists of an IFW56810 single-band Wi-Fi 4 Cloud Connectivity Manager module with powerful processing capability, a PCB antenna, an FTDI chip for the USB to serial interface, and an 8x2 pin header.

.. image:: img/gsd-1.png
	    :align: center

Ensure that pin 3 to pin 4, pin 5 to pin 6, pin 9 to pin 10 and pin 11 to pin 12 of header J60 are closed as shown in the figure before connecting the USB dongle to the PC. The PC can be used as a host for evaluation. AT commands can be sent through a serial terminal on the PC to the IFW956810 CCM kit. 

.. image:: img/gsd-2.png
	    :align: center

Getting Online
****************

Connect the CCM module to your PC
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Connect the IFW956810 Single-band Wi-Fi 4 Cloud Connectivity Manager evaluation kit to your PC using either the Type-C connector or Type-A male to Type-C female cable.

.. image:: img/gsd-3.png
	    :align: center

Run a serial terminal to communicate with the kit over USB by choosing the higher of the two enumerated COM ports with the following configuration:

================   ===========================

----------------   ---------------------------
Baud rate:         115200
Bits               8
Parity             None
Stop               1
Flow control       None
Local Echo         Yes
End of Line        Line Feed
================   ===========================


See the Setting up a serial terminal on your PC section for more details.

Once you open the serial terminal, type 


:: 

	AT+CONF? About 

in the serial terminal.  You should see a response 


::

	OK Infineon IFW56810 CCM


Connect the CCM module to Wi-Fi
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The CCM has a built-in Wi-Fi onboarding process over Bluetooth® LE or SoftAP using an app available in the app store, and Infineon also provides a mobile app SDK to make it easier for you to deliver an app to your customer.  

First,  Download and install the CIRRENT™  Wi-Fi onboarding app from `Google Play Store for Android <https://play.google.com/store/apps/details?id=com.cirrent.ZipKeyApp&hl=en_US&gl=US>`_ or `iOS App Store for iOS on your mobile phone <https://apps.apple.com/us/app/cirrent-wi-fi-onboarding/id1265896377>`_. Scan the following QR code relevant to your mobile device to download the CIRRENT™ Wi-Fi onboarding app:

Android

.. figure:: img/gsd-4.png
    :align: center

	Android

IOS

.. figure:: img/gsd-5.png
    :align: center
    
	IOS


1. To turn on the Wi-Fi onboarding process on the CCM, type the following command in the serial terminal on the PC: 

   ::

	  AT+CONFMODE

   You should receive this response from the module:

   :: 

      OK CONFMODE Enabled

2. Open the CIRRENT™ Wi-Fi onboarding app. You can skip the sign in.

3. From the menu, select **Configuration** and then choose **BLE** onboarding for the best experience. 

4. Follow the onscreen instructions and enter the Wi-Fi router’s SSID and password

At the end of this process you should see ??? and that means your CCM is connected to your Wi-Fi network. 

If prefer configuring the Wi-Fi networking using AT commands, type the following commands in sequence in the terminal application:

::

	AT+CONF SSID=<your router ssid>
	AT+CONF Passphrase=<your router passphrase>

.. note:: Your local router’s SSID and passphrase are stored securely inside the IFW56810 CCM module. While the SSID can be retrieved later (i.e., for debugging purposes), any attempt to retrieve the passphrase will return an error.   


View your CCM module connected to the CIRRENT™ Cloud
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Now you can see that the CCM module is connected to the internet by checking the binding to the CIRRENT™ Cloud: 

1. Log in to your CIRRENT™  account at https://console.cirrent.com/. If you don’t already have a CIRRENT™ account, you can register one, follow these steps.

2. On the panel on the left of the screen, select Device Management and Cloud ID, and then select the Binding tab. Alternatively, click this link to go directly to that tab. 

3. Choose your account number as follows: 
   
   .. image:: img/gsd-6.png
	    :align: center

4. You should see your device listed on the page. 

.. note:: successful binding of the device to your CIRRENT™ account is required to provision the devices to the AWS developer account using Cloud ID. 


How the CCM module interacts with AWS
**************************************

The Infineon AIROC™ CCM is pre-configured to work with AWS IoT Core.  To connect the CCM to your AWS Account, you’ll need to connect your CIRRENT™ account with your AWS account so that devices are automatically provisioned to your AWS account using CIRRENT™ Cloud ID.  You can follow the instructions in the CIRRENT™ Cloud ID documentation to set that up. 

Alternatively, you can configure a single CCM module’s device certificate manually in your AWS account by downloading the device certificate from the CIRRENT™ console, and then creating a Thing in your AWS account, using the certificate you just downloaded

The CIRRENT™ Cloud flow uses the Cloud ID solution to simplify the process of connecting the kit to your AWS developer account. This method eliminates several manual steps that need to be performed in the AWS flow. Learn more about the Cloud ID solution `here <https://swdocs.cypress.com/html/cirrent-support-documentation/en/latest/cirrent-could-id.html>`_.

At a high level, the CIRRENT™ Cloud flow performs the following functions to connect the kit to your AWS developer account: 

1. Binds your kit to your CIRRENT™ account.

2. Provisions the AWS resources for the kit on your AWS account, including the Thing (cloud representation of your physical device), device certificate (associates the device certificate from the CIRRENT™ Cloud to your Thing), policies (creates and associates AWS IoT Thing access policies to your Thing)

3. The CIRRENT™ Cloud pulls the AWS endpoint required from your AWS account and automatically pushes it to the kit. This enables the kit to connect to your AWS development account.  

The CIRRENT™ Cloud flow we describe above is very close to the production flow and demonstrates the ease of securely connecting your products to the product cloud. The CIRRENT™ Cloud is preloaded with the device certificate of all CCM/IFW56810 modules, thus offloading the effort of managing device certificates away from product manufacturers. 

Get connected to AWS
*********************

You need to follow a few steps to ensure you’re able to interact with your AWS developer account while using the CIRRENT™ Cloud ID flow for device onboarding. The following diagram illustrates the process:

.. image:: img/gsd-7.png
	    :align: center

You’ve already confirmed that the CCM kit binded to your Cloud ID account in the previous step. We’ll now outline the steps you need to take to set up your AWS instance so that you can connect your CCM kit to your Product Cloud.

1. Execute the CloudFormation template

   CloudFormation is an AWS service that helps in setting up the required resources in AWS through a template (JSON or YAML file). Executing a CloudFormation template creates a stack in the AWS CloudFormation service. A stack is a collection of AWS resources. 

   The template for creating AWS resources required for connecting the IFW956810 evaluation kit to the AWS IoT Core is already created by INFINEON and stored in Amazon S3 storage. The stack created by this template provides some outputs that can be used to establish a channel of back-end cloud communication between your CIRRENT™ account and your AWS account. 

   You need to execute the CloudFormation template only once per AWS account in a region. The same stack can be reused to provision multiple kits to the AWS account in that region. Instructions for the Infineon-provided CloudFormation template can be found here. 

2. Create a Product Cloud API
   A Product Cloud API is a software interface that allows the CIRRENT™ Cloud to communicate with your AWS developer account. To achieve this, the Product Cloud API requires certain AWS developer account details including the AWS Gateway ID obtained as part of the AWS CloudFormation template output. This API must be executed once per CIRRENT™ account. The same API can be used to provision production CCM devices from your CIRRENT™ account to your AWS account.  

   Instructions for configuring the Product Cloud API are here. 

3. Provision and prepare to connect the kit to your AWS account. 

   When new devices are bound to your account, they will be automatically configured in your AWS account, but for this first device you will need to initiate the provisioning manually.  To provision follow these steps: 

   1. In the CIRRENT™ Console, navigate to Device Management and Cloud ID, click on the Binding tab, or following this link.

      .. image:: img/gsd-8.png
	    :align: center

   2. Click the **Edit button**.

      .. image:: img/edit.png
	    :align: center

   3. Click the drop-down list in the **API Endpoint** column.

   4. Choose the Product Cloud API created in the previous step.

   5. Click Save.

   6. Click the Provision now button 

      .. image:: img/p-btn.png
	    :align: center

Provisioning via the Product Cloud API performs two functions. First, it creates the Thing for your device in the AWS Console and attaches the related policy and device certificate. It also pulls the AWS endpoint required by the device to connect to your AWS account and pushes it to the device so that the device connects to the AWS Cloud automatically. 

Connect and interact with the AWS Cloud
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Use the MQTT client in the AWS IoT Console to monitor the communication between your evaluation kit and the AWS Cloud. 

1. Navigate to the AWS IoT Console (https://console.aws.amazon.com/iot/).

2. In the navigation pane, select Test and then click MQTT Test Client.

3. In Subscribe to a topic panel, enter #, and then click Subscribe. 

Skip Section 4.6.1 if you used CIRRENT Wi-Fi onboarding app to connect the kit to Wi-Fi. 

Once the kit is connected to Wi-Fi, it will automatically connect to the AWS IoT Core. You will receive “OK 1 CONNECTED” in the serial terminal once the device is connected to the AWS IoT Core.  

Connect to the AWS IoT Core
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Enter the following command in the serial terminal to establish a secure connection to the AWS IoT Core

::

	AT+CONNECT

You will receive a response depending on the method of connection. If you used Cloud ID for registration it may take a minute or more to connect and you may see a message

::

	OK Waiting for Cloud ID registration.

After it is configured, then the device will connect to the AWS IoT Core and you will receive the message 

::

	OK 1 CONNECTED

Now you’re able to send and receive data from your AWS IoT Core account. To send data: 

::

	AT+SEND data Hello World!

After a short time, you will receive the message “OK”. You should see the “Hello World!” message appears on the AWS IoT Console under the topic “data”. 

To receive data, you’ll need to subscribe to a topic.  By default, the device subscribes to a topic called “state”. To send a message to the CCM: 

1. On the AWS IoT Console, select the MQTT client, and then select **Publish to a topic**. Type **state** in **Topic name** field. Keep the “Hello from the AWS IoT Console” message. Click **Publish**.


2. Type the following command in the serial terminal:
   
   ::
   	  
   	    AT+GET

   You will receive the message 

   ::

		OK Hello from the AWS IoT Console

Further Exploration
********************

Now that your CCM module is connected and you can try out the different capabilities of the product. Here are a few suggestions:

* Run an Over-the-Air firmware update process
* Try out other CCM Commands

Setting up a serial terminal on the PC
*****************************************

.. note:: The following instructions are only for a Windows PC. 


The IFW956810 CCM evaluation kit should be recognized by the PC when connected to it. If the device is recognized, COM ports will be available in the Device Manager.

If the device is not recognized, you need to install the FTDI USB to UART Bridge Virtual Communication Port drivers from this `link <https://ftdichip.com/drivers/vcp-drivers/>`_. For more information, see the Troubleshooting section. 

Determine the COM port number
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

* Determine the COM port number from the Device Manager. 
  
  .. image:: img/gsd-9.png
	    :align: center

Serial terminal settings
^^^^^^^^^^^^^^^^^^^^^^^^^^

1. Open a terminal such as Tera Term.

2. Choose the higher of the COM port numbers for the IFW956810 CCM evaluation kit.

3. Select **Set Up** > **Serial port**.

4. Select the settings as follows:
   
   .. image:: img/gsd-10.png
	    :align: center

5. Select **Set Up** > **Terminal**. 

6. Do the following:
   
   * Set **End of Line** as **Line Feed**. 
   * Enable **Local Echo** to view the commands that you type on the terminal.  

     .. image:: img/gsd-11.png
	    :align: center

Troubleshooting the CCM Kit
****************************

If two COM ports were enumerated when the kit is connected
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The IFW956810 CCM evaluation kit has a FT2232H chip capable of supporting USB to dual-channel UART (USB serial converter A and USB serial converter B). Only USB serial converter B is configured in the kit for USB-to-UART conversion. Therefore, use the higher-number COM port among the enumerated COM ports to communicate with the kit. 

Diagnosing errors when commands are entered
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

For example: 

::

	AT+SUBSCRIBE

returns

::

	ERR01 Invalid cmd

1. Make sure that you have typed the command correctly. 

2. Note the error codes and refer to this guide for details of the error code and to determine the cause. 


Onboarding fails when using the CIRRENT™ mobile app
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

* Check if CONFMODE was enabled using the AT+CONFMODE command.


ERR 14 UNABLE TO CONNECT received when using the AT+CONNECT command

The AT+CONNECT command first connects to Wi-Fi if not already connected and then connects to the AWS IoT Core. 

1. heck the Wi-Fi connection.

2. Check the entered Wi-Fi credentials. 

3. Type the following command to verify whether the kit connects to Wi-Fi:

   ::

	  AT+DIAG PING 8.8.8.8

   If the connection is successful, the device will respond with 

   ::

	  OK Received ping response in <ping latency ms>

4. If the Wi-Fi connection test is successful, check the AWS IoT connection. 

5. Check the device certificate uploaded to the AWS IoT Core in Section 4.4.


Changing the Wi-Fi network the device is connected to
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

1. Execute 
   
   ::

	  AT+DISCONNECT 

   on the serial terminal to disconnect from the current Wi-Fi network. 

2. See this section  to configure the required Wi-Fi credentials.  


Determine the device connection status to AWS IoT Core
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

These steps will help you to verify whether the device is waiting for the endpoint from the CIRRENT™ Cloud after the device is connected to Wi-Fi  To complete the following you needed to onboard the device using the CIRRENT™ Cloud flow, and ensure that you received an “OK 1 CONNECTED” message. 

Check if a Thing is present in the AWS IoT Console for your device
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

1. Run the following command in the serial terminal to get the ThingName of your device. 
   
   ::
      
       AT+CONF? ThingName

2. Open the `AWS IoT Console <http://console.aws.amazon.com/iot>`_.

3. From the left pane, select **Manage**, and then select **Things**.  

4. Note the **Name** of the Thing.


The ThingName shown on the serial terminal and the AWS IoT Console must be the same.  

Check for a job in the CIRRENT™ Console
"""""""""""""""""""""""""""""""""""""""""

This job should be for sending the endpoint to your device. Do the following:

1. In the CIRRENT™ Console, go to **Product Analytics** > **Device Fleet**.

2. Click the **Jobs** tab, and check the following columns for the new job created:

   * Action: ccm_config

   * Action Details: Endpoint should be the same as your AWS account endpoint.
     In the AWS IoT Console, choose **Settings**, check the endpoint under **Device data endpoint**.

   * Created Time: This should be the current time when you clicked **Provision now** in the CIRRENT™ Console.

   * Status: Active

   * Device IDs: Note the value in the Device ID field.

Check the pending state of the job
"""""""""""""""""""""""""""""""""""""""""

Do the following if a new job is available for your device. 

1. Go to **Product Analytics** > **Device Inspector** in the CIRRENT™ Console.

2. Click the **Jobs** tab, and do the following:

   * Type the device ID noted in the previous section in the Device ID text box. 

   * Under the Pending Jobs section, verify that the Job ID, Action, and Action Details are the same as shown in the previous section.

     If the “OK 1 CONNECTED” message is received in the serial terminal, the job will move from the “Pending” section to the jobs list, and the Result column will display Success and the Status column should show Completed. 

     If execution of any of the above steps didn’t match the expectation as mentioned, check the Product Cloud API details and repeat the steps in Provision and prepare to connect the kit to your AWS account

     Execute the following command in the serial terminal if steps in Provision and prepare to connect the kit to your AWS account were completed after connecting to Wi-Fi. 

     ::

         AT+CLOUD_SYNC


Device registration with CloudID service failed 
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

This message appears after connecting to Wi-Fi. The cause depends on the method of connection used.

There is an error in the provisioning step. Do the following:

1. Redo Step  Provision and prepare to connect the kit to your AWS account

2. Execute the following command in the serial terminal to pull the endpoint to the device after connecting to Wi-Fi. 

   ::

      AT+CLOUD_SYNC
