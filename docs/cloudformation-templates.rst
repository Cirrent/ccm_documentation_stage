Execute the CloudFormation template
====================================

CloudFormation is an AWS service that helps in setting up the required resources in AWS through a template (JSON or YAML file). Executing a CloudFormation template creates a stack in the AWS CloudFormation service. A stack is a collection of AWS resources.   You can read more about CloudFormation from the AWS documentation.  

A sample template for creating AWS resources required for connecting the IFW956810 evaluation kit to your product cloud  on AWS IoT Core has been created by Infineon and stored in Amazon S3 storage. The stack created by this template provides some output that can be used to authenticate & establish a cloud to cloud API between your CIRRENT account and your AWS account. 

You need to execute the CloudFormation template only once per AWS account in a region. The same stack can be reused to provision multiple kits to the AWS account in that region. 

You may want to review the CloudFormation Best Practices and Security section in the AWS documentation.  You will not need to provide Infineon with your AWS credentials if you use dynamic references.     

Do the following to execute the Infineon-provided CloudFormation template:

1.	Click on the following link to execute the CloudFormation template. By default, the link uses the us-west-1 region. 
	https://us-west-1.console.aws.amazon.com/cloudformation/home?region=us-west-1#/stacks/create/template?stackName=infineon-iot-quickstart&templateURL=https://cirrent-quickstarts.s3.us-west-2.amazonaws.com/infineon-iot-quickstart.yaml
	You can change the region in which you want to execute this template by changing the region=us-west-1 in this link to your required region. See Choosing a Region on AWS documentation. 

2.	On the **Create Stack** page in the AWS CloudFormation service with the Infineon CloudFormation template preloaded, click **Next**. 
	.. image:: img/cft-1.png
	    :align: center

3.	On the Step 2 page, retain all parameters at their default values, and click **Next**.

4.	On the Step 3 page, retain all parameters at their default values, and click **Next**.

5.	Select the boxes to provide permissions to access the resources required by the CloudFormation template. 
	.. image:: img/cft-2.png
	    :align: center

6.	Click **Create stack**. 

7.	Wait for up to five minutes for the stack creation to complete.  
	.. image:: img/cft-3.png
	    :align: center 

This stack creates an infrastructure to enable provisioning the required resources for the IFW56810 device through the CIRRENT Cloud.

8.	Click **Outputs**. 
	The output of the stack that you created is shown on this page. You will require these details to be entered in the CIRRENT Console in Step 3 of Section 4.4.1.3. 
	.. image:: img/cft-4.png
	    :align: center

 
