Using CCM with cloud platforms
===============================

AIROC™ CCM modules simplify the process of connecting your products to your Product Cloud. Key to this functionality is CIRRENT™ Cloud ID, an INFINEON service. When a user first boots up your product CIRRENT™ Cloud ID securely authenticates the device and automatically provisions the device into your Product Cloud. In this section we outline what you need to do to ensure that your CCM-equipped devices effortlessly connect to your Product Cloud.


AWS IoT Core
*************

CCM-equipped devices and Cloud ID supports AWS IoT Core. Cloud ID acts as a solution to simplify the process of connecting your products to your AWS Product Cloud and to make the process more secure. In one step, CCM:

1. Automatically binds your device to your CIRRENT™ Cloud ID account. That is possible because the certificates for AIROC™ CCM modules are pre-populated in CIRRENT™ Cloud ID.

2. Provisions the AWS resources for your device on your AWS Product Cloud. This automated provisioning includes the Thing, the AWS cloud representation of your physical device, as well as the device certificate and the necessary device policies.

3. Enables your device to connect to your AWS account. The endpoint of your AWS development account is required for the kit to connect to your AWS account.  Cloud ID pulls the AWS endpoint required from your AWS account and automatically pushes it to your device in the field.

In the next section we outline what you need to do configure your AWS Product Cloud to interact with your AIROC™ CCM devices and with CIRRENT™ Cloud ID. Note that you need an AWS account before you can get started.

Triggering the CloudFormation template 
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

CloudFormation is an AWS service that helps in setting up the required resources in AWS through a template. Executing a CloudFormation template creates a stack in your AWS account. A stack is a collection of AWS resources.

The template for creating AWS resources required for connecting your CCM devices to the AWS IoT Core is already created by INFINEON and stored in Amazon S3 storage. The stack created by this template provides some outputs that can be used to establish a channel of back-end cloud communication between your CIRRENT™ Cloud ID account and your AWS Product Cloud. 

Instructions for running the CloudFormation template are here: 

https://documentation.infineon.com/html/cirrent-support-documentation/en/latest/cirrent-could-id.html 

Performing an OTA firmware update for the AIROC™ IFW56810
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

CCM modules include a robust over-the-air (OTA) firmware update capability.  Here you can learn how to run an OTA job in your AWS account to update the firmware on your CCM devices. There are several steps involved in sending OTA updates to your device:

* Obtain the firmware package from INFINEON, you need to contact our sales team for this package
* Create an OTA update role in your AWS account and assign the necessary permissions to the role
* Create a firmware update job in your Amazon IoT Console
* On your device, check for an update job and apply it

Assuming you’ve obtained a firmware update package from INFINEON we’ll now outline the steps you need to take to apply a firmware update to a single device. You can, of course, automate some of these steps to roll out updates to a fleet of devices.

Create an OTA update role in your AWS account
"""""""""""""""""""""""""""""""""""""""""""""

Within AWS IoT you need to configure an AWS role to create and manage OTA update jobs for your devices. The following set of instructions explains the process.

**First, create an OTA service role using these steps**

1. Sign in to AWS identify and access management, by navigating to https://console.aws.amazon.com/iam/ for example.

2. View the navigation pane and choose **Roles**, and then choose **Create role**.

3. From **Select type of trusted entity**, choose **AWS Service**, and from the list of AWS servies choose **IoT**.

4. Choose IoT from the options under **Select your use case**.

5. Choose **Next: Permissions**, then **Next: Tags**, and then **Next: Review**.

Now, type in a role name and a description for your OTA update role, and then choose **Create role**.

**Next, you need to add OTA update permissions to the service role that you just created**

1. Find the search box on the AWS identity and access management console page and enter the name of your role, and then choose it from the list.

2. Choose **Attach policies**.

3. In the search box, enter "AmazonFreeRTOSOTAUpdate", and select AmazonFreeRTOSOTAUpdate from the search result. 

4. Choose **Attach policy** to attach the policy to your service role.

**You also need to add the required IAM permissions and Amazon S3 permissions through the following steps:**

Using the search box on your AWS IAM console page, enter the name of the role you created in the previous section. When the role appears in the list, select it.

1. Choose **Add inline policy**, and choose the **JSON tab**.

2. Copy and paste the following policy document into the text box:
   
   ::

     {
            "Version": "2012-10-17",
            "Statement": [
              {
                    "Effect": "Allow",
                    "Action": [
                        "iam:GetRole",
                        "iam:PassRole"
                    ],
                    "Resource": "arn:aws:iam::your_account_id:role/your_role_name"
              }
            ]
        }

   In the above code you need to replace **your_account_id** with your AWS account ID, and **your_role_name** with the name you chose for the OTA service role.

5. Choose **Review policy**.

6. Enter a name for your policy, and then select **Create policy**.

.. note:: The following steps are not required if your Amazon S3 bucket name begins with "afr-ota". If it does, the AWS-managed policy AmazonFreeRTOSOTAUpdate is already includes the required permissions.


In addition to IAM permissions you also need to add the needed Amazon S3 permissions to your OTA service role.

1. In the search box on the IAM console page, enter the name of your role, and then choose it from the list.

2. Choose **Add inline policy**, and choose the **JSON** tab.

3. Copy and paste the following policy document into the box:

   ::

        {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": [
                        "s3:GetObjectVersion",
                        "s3:GetObject",
                        "s3:PutObject"
                    ],
                    "Resource": [
                        "arn:aws:s3:::example-bucket/*"
                    ]
                }
            ]
        }

That policy grants the OTA service role you created the permission to read Amazon S3 objects. Ensure that you replace **example-bucket** with the name of your AWS S3 bucket.

1. Choose **Review policy**.

2. Enter a name for the policy, and then choose **Create policy**.

Create an AIROC™ IFW56810 firmware update job in AWS IoT Console
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

Now that you’ve created an AWS role that can execute OTA updates, you can proceed to create a job that updates the firmware for the Infineon AIROC™ IFW56810 module. The following set of instructions illustrates how you create an update job for an individual device. Once you’ve completed these steps an update job will be logged in AWS IoT, and the device will pick up the update job during its regular polling sequence, or when it next goes online, if it is currently offline.

.. note:: Before you get started, ensure you get a signed firmware image from INFINEON. Contact the INFINEON sales team for the firmware. The firmware will be provided along with the signature hashing algorithm used and signature encryption algorithm used. This information is required in subsequent steps. 

1. Open the `AWS IoT Console <http://console.aws.amazon.com/iot>`_.

2. Click **Manage**, click **Jobs**, and click **Create job**.

3. Select **Create FreeRTOS OTA Update Job**, and then click **Next**.

4. Enter a job name that is unique within your AWS account. Optionally you can also provide a description. Click **Next**.

5. From the **Devices to update** drop-down list, choose the **Thing name** with which the device you are applying the update to is registered within the account.

6. Select **MQTT** as the transfer protocol, deselect **HTTP** if selected, and select **Use my custom signed file**.

7. On the form that appears you will need important details supplied with the INFINEON firmware update. Do the following:

   * In the **Signature** field, provide the base64-encoded signature for the image
   * From the **Original hashing algorithm** drop-down list, select the hashing algorithm provided by INFINEON.
   * From the **Original encryption algorithm** drop-down list, select the encryption algorithm provided by INFINEON.
   * In the **Path name of code signing certificate on device** field, enter **NA**.

8. Select **Upload a new file**. Click **Choose file**, and navigate to the location where you stored the image file that you obtained from INFINEON.

9. Click **Create S3 bucket** to create a new bucket for the newly uploaded image (or click **Browse S3** to select an existing bucket in your account).

10. Under **Path Name of file on device**, enter **NA** if the image is not targeted as an executable file within a filesystem.

11. From the **File type** drop-down list, select the value “101” to signify that it is an IFW56810 CCM firmware update, and not a host firmware update.

12. Choose the OTA update role created above from the **Role** drop-down list under the **IAM role** section, and then click **Next**.

13. Click **Create Job**.

If you are successful, the job will be listed with the status as “in progress”, ready for the device to pick up the job.

Monitor and apply the new firmware	
"""""""""""""""""""""""""""""""""""

You’ve now created a firmware update job. The AIROC™ CCM module regularly polls for firmware update jobs. If it receives a job it validates the job, and then enters a state waiting for the update to be accepted. The application you code onto your host device subsequently receives the OTA event indicating that a new firmware image is available for the CCM module.

The host application or the user can then apply the firmware by performing the following sequence. You can update a single CCM device by entering appropriate commands in the serial terminal – or by coding these commands into the product application. Using the serial terminal, apply the OTA update as follows:

1. Query the state of the job:
   
   ::

        AT+OTA?

   You will receive a response “OK 1 New OTA proposed.”

2. Accept the new firmware update:
   
   ::

        AT+OTA ACCEPT

   The CCM module starts downloading the firmware update from the cloud.

3. Query the state of the job:
   
   ::

        AT+OTA?

   Downloading the image takes a few minutes to complete. During the OTA image download, this command returns “OK OTA in progress”. You will receive an OTA event when the download is completed and the image signature is verified.

4. Check whether the received image is verified:
   
   ::

        AT+EVENT?

   You will receive the response “OK 5 OTA event New Image verified”.

5. Apply the new image received through OTA:
   
   ::

        AT+OTA APPLY

   The IFW56810 CCM module now reboots and boots up with the new image.

6. Connect back to the AWS IoT:
   
   ::

        AT+CONNECT

   The IFW56810 CCM module should now connect to AWS IoT, complete the self-test and mark the image as valid. This prevents further rollback to the old image.

   You can check the job status by going back to the AWS IoT Console. You should see the job status as completed.
   


Performing a host OTA firmware update
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Performing host firmware over-the-air update. The IFW56810 CCM device supports host firmware over-the-air updates. To do so, follow these steps. 
Skip the prerequisites if you already have the OTA update role in your AWS account.

Prerequisites
"""""""""""""""
Create an OTA update role in your AWS account using the steps outlined in the previous section.

Create a firmware update job in AWS IoT
""""""""""""""""""""""""""""""""""""""""""""""
1.	Open AWS IoT Console. 

2.	Click **Manage**, and then under Remote actions click **Jobs**.  

3.	Click **Create job**.

4.	Select **Create FreeRTOS OTA Update Job**, and then click **Next**.

5.	Provide a job name which is unique within your AWS account. Optionally, provide a description, and then click **Next**.

6.	From the **Devices to update** drop-down list, choose the **Thing name** with which the IFW56810 CCM evaluation kit is registered in the account. 

7.	Select **MQTT** as the transfer protocol, and deselect HTTP if selected.

8.	Select **Use my custom signed file**. 

9.	On the form that appears: 
•	In the signature field, provide the base64-encoded signature for the image. If the image is not signed, enter NA.
•	From the Original hashing algorithm drop-down list, select the hashing algorithm. If not used, leave it as is.
•	From the Original encryption algorithm drop-down list, select the encryption algorithm. If not used, leave it as is.
•	In the Path name of code signing certificate on device field, enter NA.

10.	Select **Upload a new file**. 

11.	Click **Choose file and upload the image**. 

12.	Do one of the following: 
•	Click Create S3 bucket to create a new bucket for the new uploaded image.
•	Click Browse S3 to select an existing bucket in your account.

13.	Under **Path Name of file on device**, enter NA if the image is not targeted as an executable file within a filesystem.

14.	From the **File type** drop-down list, select a value “202” to signify that it is an IFW56810 CCM host firmware update.

15.	Choose the OTA update role created above from the Role drop-down list under the **IAM role section**, and then click **Next**.

16.	Click **Create Job**. 

Monitor and load the firmware update to the host 
""""""""""""""""""""""""""""""""""""""""""""""""

The host application or the user can perform the following sequence by entering appropriate commands in the serial terminal:

1.Query the state of the job: 

   ::

        AT+O	TA? 

You will receive a response

   ::

        OK 2

2.	Accept the new firmware update:

   ::

        AT+OTA ACCEPT

The IFW56810 CCM module starts downloading the firmware update from the cloud

3.	Query the state of the job:

   ::

        AT+OTA? 

Downloading the image takes a few minutes to complete. During the HOTA image download, this command returns “OK 3”. Once the image is downloaded this command will return “OK 5”

4. Host can send the following command to the IFW56810 CCM module to receive the image 

   ::

        AT+OTA READ <read size> 

This command will respond with

   ::

        OK {count} {data} {checksum}

The byte count is expressed in hex (from 1 to 6 digits), each byte is then presented as a pair of hex digits (no spaces) for a total of count*2 characters followed by a checksum (2 hex digits).

The reading pointer is advanced by count bytes.

Note:	  The IFW56810 CCM module is capable of reading maximum of 2k bytes at a time. 


Receive data and commands from the cloud
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

We discuss the use of AT communications commands in detail in the CCM API section. Here we’ll show you how you use the AWS IoT Console to publish messages to topics and to view messages received from the CCM module. 

By default, every CCM device subscribes to a topic called “state”. You can test cloud to device communications by publishing content to this topic. To try it out you need to complete some steps in AWS IoT Console, while sending commands to your device using the serial terminal. Do the following on the AWS IoT Console:

* Select the **MQTT client**, and then select **Publish to a topic**.
* Type state in **Topic name field**. Keep “Hello from the AWS IoT Console” message.
* Click **Publish**.

Type the following command into the serial terminal:

::

    AT+GET

You will receive the message “OK Hello from the AWS IoT Console.”



Publish to a non-default topic
"""""""""""""""""""""""""""""""

If you want to publish data on a non-default topic you can make use of the following commands which you enter in sequence in the serial terminal:

::

    AT+CONF Topic1=/MyPubTopic
    AT+SEND1


Subscribe to a non-default topic
"""""""""""""""""""""""""""""""

If you want to subscribe to a non-default topic, you first need to enter a set of commands on your CCM module:

::

    AT+CONF Topic2=/MySubTopic
    AT+SUBSCRIBE2

Next, you need to perform a sequence of actions in AWS to publish to a topic. Do the following on the AWS IoT Console:

* Select the **MQTT client**, and then select **Publish to a topic**.
* Type **MySubTopic** in the **Topic name** field. Keep the “Hello from the AWS IoT Console” message.
* Click **Publish**.

You now have content that was published to a topic. Next, you can retrieve that content on your device. To do so, use your serial terminal and enter the following command:

::

    AT+GET2

You will receive the message “OK Hello from the AWS IoT Console”, which is the data contained in the topic you subscribed to.
