:raw-latex:`\page `airoc_ccm_at_commands Cloud Connectivity Manager(CCM)
AT commands AIROC™ CCM module supports the AT commands specified in `AWS
IoT ExpressLink Programmers
Manual <https://docs.aws.amazon.com/expresslink>`__.:raw-latex:`\n`
Additionally the CCM module supports below diagnostic commands, which
assists the developer to perform diagnostics and debugging.

Enable/Disable Logging
======================

By default logging is disabled in CCM module.

Command
-------

   AT+DIAG LOG X\n

Parameter
~~~~~~~~~

X - Log Level :raw-latex:`\n`

::

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

Response
--------

   OK\n

Sample command and response messages
------------------------------------

**Command** > AT+DIAG LOG 4\n

**Response** > OK\n

PING
====

Initiate ping to a given IPv4 address from CCM module.

.. _command-1:

Command
-------

   AT+DIAG PING x.x.x.x\n

.. _parameter-1:

Parameter
~~~~~~~~~

x.x.x.x - IPv4 address

.. _response-1:

Response
--------

   OK Received ping response in Yms\n

.. _sample-command-and-response-messages-1:

Sample command and response messages
------------------------------------

**Command** > AT+DIAG PING 8.8.8.8\n

**Response** > OK Received ping response in 34ms\n

ECHO
====

By default command echo is disabled in CCM module. Enable/Disable
command echo by using below command.

.. _command-2:

Command
-------

   AT+DIAG ECHO X\n

.. _parameter-2:

Parameter
~~~~~~~~~

X - ENABLE or DISABLE :raw-latex:`\n`

::

   ENABLE  - Enables command echo
   DISABLE - Disables command echo

.. _response-2:

Response
--------

   OK\n

.. _sample-command-and-response-messages-2:

Sample command and response messages
------------------------------------

**Command** > AT+DIAG ECHO ENABLE\n

**Response** > OK\n

SCAN
====

Initiates a SCAN of nearby Wi-Fi access points with a timeout of X
seconds from CCM module.

.. _command-3:

Command
-------

   AT+DIAG SCAN X\n

.. _parameter-3:

Parameter
~~~~~~~~~

X - Seconds

.. _response-3:

Response
--------

   OK SSID :XXXXX DB :YY Channel :ZZ\n

.. _sample-command-and-response-messages-3:

Sample command and response messages
------------------------------------

**Command** > AT+DIAG SCAN 5\n

**Response** > OK SSID :IFX_AP_01 DB :-74 Channel :11\n > OK SSID
:IFX_AP_02 DB :-71 Channel :11\n
