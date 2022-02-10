CCM API Guide
===============

The AIROC™ CCM module supports a full range of AT commands, that includes all relevant AWS IoT ExpressLink AT commands. CCM modules also follow the AWS IoT ExpressLink AT command format. In this section we outline how you should use AT commands, and list the commands you can use.

AT Command Usage
******************

AIROC™ CCM modules support execution of AT commands through USB serial device COM port or over the air. Every CCM module command must be sent in this format:

::

	AT+{command}[#][?]{separator}[parameter]{eol}

The above format contains the following elements:

===============   ===============================================================================================================
{command}         A short string that matches one of the available listed commands. Commands are not case sensitive, but for 
                  consistency this document lists commands in uppercase.

[#]               Decimal suffix qualifier used by a few commands. ‘PARAMETER ERROR’ is returned if the command does not use a 
                  numeric suffix, or if the suffix is outside of the valid range.

[?]               Query marker that is used with some commands, indicating that information is requested. Commands that does not 
                  respond to a query request will return ‘INVALID QUERY’ if the query marker is used.

{separator}       This separator is the ASCII character for a single space, 0x20. Inserting any other character here will return 
                  ‘PARSE ERROR’.

[parameter]       ASCII string containing the data required for the command, must be escaped. 'PARAMETER ERROR' is returned if 
                  the command cannot process the supplied parameter.

{eol}             This end of line mark is the ASCII character for a new line, 0x0a. Inserting any other character here will 
                  return ‘PARSE ERROR’.
===============   ===============================================================================================================

.. note:: The parameter includes every byte between the separator and eol, but does not include either separator or eol. ASCII values from 0 to 0x1F are valid for the parameter string.

.. note:: The complete formatted command string is capped to 5KB in length.

.. note:: The maximum runtime for every command must be listed in the datasheet. No command can take more than 120 seconds to complete (the maximum time for a TCP connection timeout).

Command error codes
********************

The standard format for error codes is:

::

 	OK|ERR{#}{separator}[detail]{eol}

Where ERR is the error code, responding to the list of errors below:

=======   ============================   =====================================================================================
1         OVERFLOW                       More bytes have been received than fit in the receive buffer.
2         PARSE ERROR                    Message not formatted correctly.
3         COMMAND NOT FOUND              Invalid command.
4         PARAMETER ERROR                Command does not recognize the parameters.
5         INVALID ESCAPE                 An incorrect escape sequence was detected.
6         NO CONNECTION                  Command requires an active connection to AWS IoT.
7         TOPIC OUT OF RANGE             The topic index is larger than the maximum valid topic index.
8         TOPIC UNDEFINED                The topic index provided references an empty topic position.
9         INVALID KEY LENGTH             Key is longer than 16 characters.
10        INVALID KEY NAME               A non-alphanumeric character was used in the key name.
11        UNKNOWN KEY                    The supplied key cannot be found in the system.
12        KEY READONLY                   The key cannot be written.
13        KEY WRITEONLY                  The key cannot be read.
14        UNABLE TO CONNECT              The module is unable to connect.
15        TIME NOT AVAILABLE             A time fix could not be obtained.
16        LOCATION NOT AVAILABLE         A location fix could not be obtained.
17        MODE NOT AVAILABLE             The requested mode is not available.
18        ACTIVE CONNECTION              An active connection prevents the command from running.
19        HOST IMAGE NOT AVAILABLE       A host OTA command was issued but no valid HOTA image is present in the OTA buffer.
20        INVALID ADDRESS                The OTA buffer pointer is out of bounds (> image size).
21        INVALID OTA UPDATE             The OTA update failed.
22        INVALID QUERY                  The command does provide a query option.
23        INVALID SIGNATURE              A signature verification failed.
=======   ============================   =====================================================================================


AT operational commands
**************************

Here is a complete list of AT commands supported by AIROC™ CCM modules.

================================================   ================================================
Function                                           Command
------------------------------------------------   ------------------------------------------------
CCM-to-host communication test                     AT
Connect to the Product Cloud                       AT+CONNECT
Disconnect from the Product Cloud                  AT+DISCONNECT
Check Product Cloud connection status              AT+CONNECT?
Request to enter a low power mode                  AT+SLEEP
Reset internal state of the module                 AT+RESET
Perform a factory reset of the CCM module          AT+FACTORY_RESET
Request current time                               AT+TIME?
Request current location                           AT+WHERE?
Diagnostic commands                                AT+DIAG
Configuration commands                             AT+CONF
Read configuration                                 AT+CONF?
Enter WiFi credentials, SoftAP mode                AT+CONFMODE
Publish msg on the specified topic                 AT+SEND
Request next message pending on a topic            AT+GET
Subscribe to a specific topic                      AT+SUBSCRIBE
Unsubscribe from Topic                             AT+UNSUBSCRIBE
Request the next event in the queue                AT+EVENT
OTA update                                         AT+OTA
================================================   ================================================

Communication Test
^^^^^^^^^^^^^^^^^^^

When you simply send the 'AT' (attention) command the host verifies that the module command parser is ready and present.
Example:

::

	AT    # requests the module’s attention

Returns:

::

	OK

So, if the module is connected and if the command parser is active, the module will respond with 'OK'.

Connect to the AWS IoT Core
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Request a connection to the cloud, which also brings the active device into a higher power consumption mode to communicate with the cloud endpoint.

Command: 

::

	AT CONNECT

Returns:

::

	OK 1 CONNECTED

If the connection the cloud endpoint was successful, or 

::

	ERR14 UNABLE TO CONNECT [detail]

Where the module could not connect, including additional details such as “Invalid Endpoint”. 

.. note:: if the module is already connected sending a CONNECT won’t return an error – it would simply return “OK CONNECTED”. 

.. note:: if connection fails a timestamp of the event will be retained to ensure that subsequent connection attempts do not exceed backoff timing limits. Any request to reconnect falling foul of the timing limits will simply be delayed by the module, and attempted automatically according to the backoff algorithm.

Example code:

::

	AT+CONNECT        # request to connect
	OK 1 CONNECTED    # connection established successfully
	Or
	ERR14 UNABLE TO CONNECT Invalid Endpoint


Check Product Cloud Connection Status
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Requests the status of the CCM module’s connection to your Product Cloud.

Command:

::

	AT CONNECT?

Returns: 

If the connection is active the module returns

::

	OK 1  

If the connection is inactive the module returns

::

	OK 0

Disconnect from the Product Cloud
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

You can use this command to allow your host to prepare to transition to low power (you would use this command before the SLEEP command). You can also use this command to update connection parameters before a new connection is made using updated parameters. 

Command: 

::

	AT DISCONNECT

Returns:

::

	OK 0 DISCONNECTED

.. note:: If a module is already disconnected the command will simply return ('OK').

Enter a low power mode
^^^^^^^^^^^^^^^^^^^^^^^^^

Sending this command enters your module into low power mode. If you do not specify a duration the module will remain in low power mode until an external reset event is triggered, or a new AT+CONNECT command is received.

Command:

::

	AT+SLEEP 

Returns:

::

	OK

If the device is ready, indicates the device is going to immediately enter into low power mode.

::

	ERR18 ACTIVE CONNECTION

This error is returned when an active connection to your Product Cloud exists. The device will not enter into low power mode. Use the DISCONNECT command first to terminate the active connection.

Code sample:

::

	AT+SLEEP 100 		 # Disconnect and suspend all activities for 100 seconds
	OK 		               # Drop connections and goes to sleep 
	AT+CONNECT    		# Resume connection and all pending activities 


Reset the CCM internal state
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Use this command to disconnect the device - if it is connected - and to reset its internal state. Any configuration parameters that are non-persistent are reinitialized and all subscriptions are terminated. This command also emptied the message queue.

Command:

::

	AT+RESET

Returns:

::

	OK

Indicating that the command is successful.

Factory reset
^^^^^^^^^^^^^^^

This command executes a full factory reset of the CCM module, re-initializing all non-persistent configuration parameters, and also specific persistent keys as specified in the configuration dictionary.

Command:

::

	AT+FACTORY_RESET

Returns:

::

	OK

Indicating that the command is successful.

Get the time
^^^^^^^^^^^^^^

This command requests the current time information on the device, or returns an error if for some reason the time information could not be determined.

Command:

::

	AT+TIME?

Returns:

::

	OK {date YYYY/MM/DD} {time hh:mm:ss.xx} {source}

If time information is available and if it was recently obtained.

::

	ERR15 TIME NOT AVAILABLE

If a recent time fix could not be obtained.

Request CCM location 
^^^^^^^^^^^^^^^^^^^^^

This command requests the last location information as available alongside a timestamp that specifies when that location reading was taken. An error is returned if a location fix cannot be determined.

Command:

::

	AT+LOCATION?

Returns:

::

	OK {date} {time} {lat} {long} {elev} {accuracy} {source}

If location coordinates could be obtained at date/time.

::

	ERR16 LOCATION NOT AVAILABLE

If a location fix could not be obtained.


CCM diagnostic commands
^^^^^^^^^^^^^^^^^^^^^^^^

The Cloud Connectivity Manager (CCM) offers a set of AT commands that can help you understand the networking environment of the device. For CCM devices, the AT DIAG offers users four different functions – LOG, PING, ECHO and SCAN.


AT+DIAG LOG
"""""""""""""

You can enable and disable logging for a device by using the DIAG LOG command. This command is executed as follows:

AT+DIAG LOG X
"""""""""""""

Where parameter X has a value of 0, 1, 2… 9. For each value of X, the level of logging is as follows: 

0. "LOG_OFF"
1. "LOG_ERR"
2. "LOG_WARNING"
3. "LOG_NOTICE"
4. "LOG_INFO"
5. "LOG_DEBUG0"
6. "LOG_DEBUG1"
7. "LOG_DEBUG2"
8. "LOG_DEBUG3"
9. "LOG_DEBUG4"

Command

::

	AT+DIAG LOG 4

Response

::

	OK


AT+DIAG PING
"""""""""""""

With this command you initiate a ping to a specified IPv4 address from the CCM module.

Command

::

	AT+DIAG PING x.x.x.x

Where the parameter x.x.x.x is the IPv4 address

For example:

::

	AT+DIAG PING 8.8.8.8

Response

::

	OK Received ping response in 34ms


AT+DIAG ECHO
"""""""""""""

By default, the echo command is disabled in the CCM module. You can enable the echo command using the follow AT sequence:

Command

::

	AT+DIAG ECHO

Response

::

	OK


AT+DIAG SCAN
"""""""""""""

Initiates a scan of nearby Wi-Fi access points, with a timeout parameter of X seconds. Returns a list of Wi-Fi access points.

Command

::

	AT+DIAG SCAN X

Parameter

X - Specifies number of seconds

Response

:: 

	OK SSID :XXXXX DB :YY Channel :ZZ

Code sample:

::

	AT+DIAG SCAN 5

Response:

::

	OK SSID :IFX_AP_01 DB :-74 Channel :11\n OK SSID :IFX_AP_02 DB :-71 Channel :11\n


AT configuration commands
***************************

You perform configuration tasks by submitting configuration data with AT+CONF, and by retrieving configuration data via using AT+CONF?

Configuration Dictionary
^^^^^^^^^^^^^^^^^^^^^^^^^^

The configuration dictionary is a key-value store containing all the options necessary for the proper functioning of ExpressLink modules. Maximum key length is 16 characters. A key can be from 1 to 16 characters. You will receive the following error if you send a command with a key that is longer than 16 characters:

::

	ERR9 INVALID KEY LENGTH

Valid key characters are 0-9, A-Z, a-z, a key may only contain alphanumeric characters in any order. If you use non-alphanumeric characters in a key name the CCM module will return:

::

	ERR10 INVALID KEY NAME

All keys for the CCM module are predefined, if you use an invalid key is used the module returns this error:

::

	ERR11 UNKNOWN KEY





Persistent keys
^^^^^^^^^^^^^^^^^

You can use key-value pairs to set default values for command parameters. You can also use key-value pairs to set credentials, for selecting connectivity options and for timing preferences. The following persistent configuration key-value pairs should be long-lived and constant for the life of your application, and stored in non-volatile memory. A basic set of pairs is defined for all CCM devices. That includes the AP endpoint and the certificate. 

.. note:: Some of the below key-value pairs have factory presets, may be read only, or both.


+---------------------------------------------------------------------------------------------+----------------------------------------------------+
| Configuration dictionary for persistent keys                                                |                                                    |
+==========================+=======+==========+==============================+================+====================================================+
| Configuration Parameter  | Type  | Persist  | Initial Value                | Factory Reset  | Description                                        |
+--------------------------+-------+----------+------------------------------+----------------+----------------------------------------------------+
| About                    | R     | Y        | Vendor - Model               | N              | A string that identifies the device make and model |
+--------------------------+-------+----------+------------------------------+----------------+----------------------------------------------------+
| Version                  | R     | Y        | Module firmware version      | N              | The specific CCM firmware version.                 |
+--------------------------+-------+----------+------------------------------+----------------+----------------------------------------------------+
| TechSpec                 | R     | Y        | Technical Specification      | N              | Your CCM module’s technical specification version  |
|                          |       |          |                              |                | number - e.g v1.1                                  |
+--------------------------+-------+----------+------------------------------+----------------+----------------------------------------------------+
| ThingName                | R     | Y        | UID                          | N              | A unique identifier specific to the device, the    |
|                          |       |          |                              |                | unique ID (UID) is hard-coded to every device,     |
|                          |       |          |                              |                | delivered natively by the module’s hardware root   |
|                          |       |          |                              |                | of trust.                                          |
+--------------------------+-------+----------+------------------------------+----------------+----------------------------------------------------+
| Certificate              | R     | Y        | Device Birth Certificate     | N              | Device certificate used to authenticate your CCM   |
|                          |       |          |                              |                | module with Cloud ID, signed by the INFINEON CA.   |
+--------------------------+-------+----------+------------------------------+----------------+----------------------------------------------------+
| EndPoint                 | R/W   | Y        | Product Cloud endpoint       | Y              | The endpoint of the Product Cloud account to       |
|                          |       |          |                              |                | which the CCM module connects.                     |
+--------------------------+-------+----------+------------------------------+----------------+----------------------------------------------------+
| TopicRoot                | R/W   | Y        | UID                          | Y              | A default prefix that is used for user-defined     |
|                          |       |          |                              |                | topics.                                            |
+--------------------------+-------+----------+------------------------------+----------------+----------------------------------------------------+
| HOTAcertificate          | R/W   | Y        | {empty}                      | Y              | Host OTA certificate                               |
+--------------------------+-------+----------+------------------------------+----------------+----------------------------------------------------+
| OTAcertificate           | R/W   | Y        | Vendor OTA Certificate       | N              | Module OTA certificate.                            |
+--------------------------+-------+----------+------------------------------+----------------+----------------------------------------------------+
| SSID                     | R/W   | Y        | {Empty}                      | Y              | SSID for the Wi-Fi router the device is            |
|                          |       |          |                              |                | connected to.                                      |
+--------------------------+-------+----------+------------------------------+----------------+----------------------------------------------------+
| Passphrase               | W     | Y        | {Empty}                      | Y              | Passphrase for the Wi-Fi router the device is      |
|                          |       |          |                              |                | connected to.                                      |
+--------------------------+-------+----------+------------------------------+----------------+----------------------------------------------------+


Non-persistent keys
^^^^^^^^^^^^^^^^^^^^^^

Additional configuration parameters are non-persistent, and they are re-initialized at power up, or following any reset event. Among these are the topics list items, see the section on AT messaging. The host processor has to re-initialize them following any reset, and possibly a deep-sleep awakening (depending on the implementation).

Configuration dictionary for non-persistent keys

+--------------------------+-------+----------+------------------------------+---------------------------------------------+
| Configuration Parameter  | Type  | Persist  | Initial Value                | Description                                 |
+==========================+=======+==========+==============================+=============================================+
| IPv4Address              | R     | N        | 0.0.0.0                      | The IPv4 address of the device              |
+--------------------------+-------+----------+------------------------------+---------------------------------------------+
| IPv6Address              | R     | N        | ::                           | Current device IPv6 address                 |
+--------------------------+-------+----------+------------------------------+---------------------------------------------+
| DNSAddress               | R     | N        | 0.0.0.0                      | Current DNS address (IPv4 or IPv6)          |
+--------------------------+-------+----------+------------------------------+---------------------------------------------+
| GatewayAddress           | R     | N        | 0.0.0.0                      | Current router IP address (IPv4 or IPv6)    |
+--------------------------+-------+----------+------------------------------+---------------------------------------------+
| Topic1                   | R/W   | N        | {Empty}                      | Custom defined topic 1                      |
+--------------------------+-------+----------+------------------------------+---------------------------------------------+
| Topic2                   | R/W   | N        | {Empty}                      | Custom defined topic 2                      |
+--------------------------+-------+----------+------------------------------+---------------------------------------------+
| ...                      |       |          |                              |                                             |
+--------------------------+-------+----------+------------------------------+---------------------------------------------+
| Topic<Max Topic>         | R/W   | N        | {Empty}                      | Custom defined topic MaxTopic               |
+--------------------------+-------+----------+------------------------------+---------------------------------------------+



Assign a value to selected configuration parameter
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Command

::

	AT+CONF key=value

Returns

::

	OK

If the command was successful, the module returns 'OK'.

::

	ERR# {message}

If the command was not successful, the module returns an error.

Example:

::

	AT+CONF SSID=MY_SSID    # Assign the preferred (local) Wi-Fi router SSID

If the write is successful, then the module returns 'OK'.

Possible errors:

==================================   ==============================================
ERR9 INVALID KEY LENGTH              The key is too long
ERR10 INVALID KEY NAME               The key contains incorrect characters
ERR11 UNKNOWN KEY                    The key is not present in the system
ERR13 KEY READONLY                   The key is read-only and can’t be written to
==================================   ==============================================


Read value of selected configuration parameter
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Command:

::

	AT+CONF? key

Returns:

::

	OK {value}

If the command was successful, the module returns 'OK' followed by the value.

::

	ERR# {message}

If the command was not successful, the module returns an error.

Possible errors:

==================================   ==============================================
ERR9 INVALID KEY LENGTH              The key is too long
ERR10 INVALID KEY NAME               The key contains incorrect characters
ERR11 UNKNOWN KEY                    The key is not present in the system
ERR13 KEY WRITEONLY                  The key is write-only and can’t be read
==================================   ==============================================


Entering Wi-Fi credentials
^^^^^^^^^^^^^^^^^^^^^^^^^^^

AIROC™ CCM module supports Wi-Fi SoftAP onboarding. To enable this feature you are expected to use CONFMODE to receive additional connection credentials from user input.

Use this command to enter SoftAP mode, where the host temporarily assumes the role of an Access Point. After enabling Wi-Fi SoftAP onboarding, user needs to use CIRRENT™ Wi-Fi Onboarding mobile app to onboard the AIROC™ CCM module. See the Wi-Fi onboarding section.

Command:

::

	CONFMODE [parameter]

Returns:

::

	OK CONFMODE ENABLED

The device entered CONFMODE and is ready to proceed with SoftAP onboarding.


::

	ERR18 CURRENT CONNECTION

The device cannot enter CONFMODE due to a current connection, first use DISCONNECT.

A CONFMODE notification event is generated once the SoftAP process is complete. Only after that can the host issue a CONNECT command to establish a connection using the newly entered credentials. See the Event handling section.


.. note:: While in CONFMODE, the CCM module can continue to respond to commands, with the exception of commands that require an active connection such as ‘AT+CONF? Version’. Where the device in CONFMODE a command that requires an active connection will return an error   'ERR6 NO CONNECTION'. Likewise, if you try to use a CONNECT command while in CONFMODE you will get a response stating:  'ERR14 UNABLE TO CONNECT'.

.. note:: use the RESET command at any time to shut down CONFMODE.


AT messaging commands
**********************

CCM modules have a messaging system that uses a list of topics that are defined by a configuration dictionary. See configuration dictionary in the previous section. Each of these topics is assigned a specific index that can be used to access the string value. Index 0 is reserved, other index values can be used by the device to define additional topics.

Topic usage rules
^^^^^^^^^^^^^^^^^^

The following rules apply to CCM modules when using topics:

Default TopicRoot
"""""""""""""""""""

Use the topic root to prefix topics used during SEND/GET and SUBSCRIBE commands, it is intended to simplify the work your device needs to do to put together a path containing its UID (ThingName).

Prefix topic strings with '/' to indicate they are complete
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

Any topic string which is prefixed with a ‘/’ are seen as complete, the topic root won’t be added to that topic name. Note the leading ‘/’ will be stripped.

Data topics for publishing: <TopicRoot>/<Topic@Index>
""""""""""""""""""""""""""""""""""""""""""""""""""""""

To create a topic name for publishing you combine the TopicRoot as set in the CONF dictionary with the values at the indexed position in the topic table.

Data topics for receiving <TopicRoot>/<Topic@Index>
""""""""""""""""""""""""""""""""""""""""""""""""""""
To create a topic name for subscription you combine the TopicRoot as set in the CONF dictionary with the value at the indexed position in the topic.

.. note:: Topic Index 0 is reserved. It acts as a catch-all when your device sends a message that does not match another, existing topic. Therefore, the list of topics cannot contain an entry for Topic0.

.. note:: Topic Index{MaxTopic} is a value that depends on your implementation, it must be ≥ 16.


Publish a message on the specified topic
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Command:

::

	AT+SEND {topic} message

Where:

::

	{topic}

A string formatted according to topic rules.

::

	message

The message to publish (string).

Sample:

::

	AT+SEND data Hello World    # Publish the classic 'Hello World' message on topic 'data'
	OK                          # Message sent

Publish msg on a topic selected from topic list
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Command:

::

	AT+SEND{#} message: 

Where {#} is the index number of a topic in CONFIG dictionary (1..MaxTopic), and message the message to publish (string).

Sample

::

	AT+SEND2 Hello World    # Publish 'Hello World' on Topic2
	OK                      # Message Sent

or

::

	ERR6 NO CONNECTION  #  no connection has been made

or

::

	ERR7 TOPIC OUT OF RANGE  # If the supplied topic index is larger than the maximum allowed topic number

Or 

::

	ERR8 TOPIC UNDEFINED #  If the supplied topic index points to a topic entry that has not been defined


Retrieve the next message received
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Command

::

	AT+GET

Returns

::

	OK{separator}<Topic>{separator}<MESSAGE>{eol}    

If there are any messages available on a topic the CCM module responds with OK, followed by the topic name and the message.

Sample

::

	AT+GET                 # poll for messages received on any topic
	OK data Hello World    # a message was received from topic 'data'
	OK{eol} #  If no message was received on any topic



Request next message pending on an unassigned topic
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Command

::

	AT+GET0

Returns

::

	OK{separator}<Topic>{separator}<MESSAGE>{eol}

Sample

::

	AT+GET0                # this command polls for messages received on any unassigned topic
	OK data Hello World    # a message was received from topic 'data'

or

::

	OK{eol} #If no message was received on any unassigned topic, the module returns 'OK' followed by {eol}.

Request next message pending on the indicated topic
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Command:

::

	AT+GET{#}

Retrieve the next message received on a topic at the specified index # (1..MaxTopic) in the topic list.

Returns:

::

	OK{separator}{MESSAGE}{eol}

If a message is available on the indicated topic, the module responds with 'OK' followed immediately by the message.

Sample

::

	AT+GET2           # select messages received on Topic2
	OK Hello World    # a message received on the topic at index 2 in the list of topics

or

::

	OK{eol}  #If a message is NOT available matching the requested topic

or

::

	ERR7 TOPIC OUT OF RANGE # If the supplied topic index is larger than the maximum allowed topic number

or

::

	ERR8 TOPIC UNDEFINED # If the requested topic is not defined


Message queue overflow conditions
""""""""""""""""""""""""""""""""""

If your device never retrieves a message, and never frees up space, the buffer capacity can be exceeded which leads to an overrun. When that happens the oldest message in the buffer is lost, and the condition is reported as an OVERFLOW event in the event queue. 

Subscribe to the indicated topic
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Command

::

	SUBSCRIBE{#}

Subscribes to the topic number and starts receiving messages, any incoming messages will trigger an event. Messages can be read with a GET{#} command. 

.. note:: it is a stateless feature as your device will request a subscription to the MQTT broker, but it will not retain information about its current state.

.. note:: sending a message to a topic to which the device is subscribed results in the broker sending a copy back to the module.

Example 1:

::

	AT+CONF TopicRoot=building1/floor1
	AT+CONF Topic1=sensor1/state
	AT+SUBSCRIBE1    # The module will subscribe to the topic building1/floor1/sensor1/state


Example 2:

::

	AT+CONF Topic2=/sensor1/state
	AT+SUBSCRIBE2    # The module will subscribe to the topic sensor1/state
	Returns:
	ERR6 NO CONNECTION # If no connection has been made
	ERR8 TOPIC UNDEFINED # If the requested topic is not defined
	ERR7 TOPIC OUT OF RANGE # If the supplied topic index is larger than the maximum allowed topic number


Unsubscribe from Topic#
^^^^^^^^^^^^^^^^^^^^^^^^^

Command

::

	UNSUBSCRIBE{#}

Sample:

::

	AT+CONF TopicRoot=building1/floor1
	AT+CONF Topic1=sensor1/state
	AT+SUBSCRIBE1      # The module will subscribe to topic building1/floor1/sensor1/state
	AT+UNSUBSCRIBE1    # The module will unsubscribe topic building1/floor1/sensor1/state

Returns:

::

	ERR6 NO CONNECTION # if no connection has been made
	ERR8 TOPIC UNDEFINED # If the requested topic is not defined
	ERR7 TOPIC INDEX OUT OF RANGE # If the supplied topic index is larger than the maximum allowed topic number


Request the next event in the queue
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

An event is essentially an asynchronous message on a topic that a CCM module has subscribed to and on which it is receiving and queuing messages. That includes error messages that reflect an unexpected change in the internal state of a device.

You can poll events periodically, using the EVENT? command. Where there is more than one event in the queue, that value returned by the EVENT? command will reflect the last event that occurred. 

.. note:: Sleep, reset, and factory reset commands automatically clear all pending events.

Command:

::

	AT+EVENT?

Returns:

::

	OK [{event_identifier} {parameter} {mnemonic [detail] }]{{eol}

or

::

	OK{eol}  # If the event queue is empty, then the 'OK' response is followed immediately by {eol}.

The table below outlines common event identifiers and error codes as used by CCM modules. 


+---------------------------------------------------------------------------------------------------------------------------+
| CCM event codes                                                                                                           |
+====================+================+==========================+==========================================================+
| Event Identifier   | Parameter      | Mnemonic                 | Description                                              |
+--------------------+----------------+--------------------------+----------------------------------------------------------+
| 1                  | Topic Index    | MSG                      | Indicates that a message was received on topic #.        |
+--------------------+----------------+--------------------------+----------------------------------------------------------+
| 2                  | 0              | STARTUP                  | The module has entered the active state.                 |
+--------------------+----------------+--------------------------+----------------------------------------------------------+
| 3                  | 0              | CONLOST                  | Connection lost.                                         |
+--------------------+----------------+--------------------------+----------------------------------------------------------+
| 4                  | 0              | OVERRUN                  | Receive buffer overrun (topic in detail).                |
+--------------------+----------------+--------------------------+----------------------------------------------------------+
| 5                  | 0              | OTA                      | OTA event (see OTA? for detail).                         |
+--------------------+----------------+--------------------------+----------------------------------------------------------+
| 6                  | 0              | SHADOW                   | SHADOW event.                                            |
+--------------------+----------------+--------------------------+----------------------------------------------------------+
| 7                  | 0              | CONFMODE                 | CONFMODE exit with success.                              |
+--------------------+----------------+--------------------------+----------------------------------------------------------+
| ≤ 999              | -              |                          | RESERVED.                                                |
+--------------------+----------------+--------------------------+----------------------------------------------------------+
| ≥1000              | -              |                          | Available for custom implementation.                     |
+--------------------+----------------+--------------------------+----------------------------------------------------------+


