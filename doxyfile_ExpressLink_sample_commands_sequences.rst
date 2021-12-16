:raw-latex:`\page `airoc_ccm_at_command_sequence Sample command
sequences Below are the list of AT commands which a user can use to
connect with AWS IoT and test MQTT publish and subscribe.

Configure Wi-Fi credentials.
============================

   AT+CONFIG SSID=AnyRouter:raw-latex:`\n` AT+CONFIG
   Passphrase=AnyPassword

Configure AWS Endpoint address
==============================

   AT+CONF EndPoint=EndPoint_address

Connect to Wi-Fi and AWS IoT cloud
==================================

   AT+CONNECT

Check Connection status
=======================

   AT+CONNECT?

Configure Root Topic
====================

   AT+CONF TopicRoot=Room1

Configure Topics
================

   AT+CONFIG Topic1=Light1:raw-latex:`\n` AT+CONFIG Topic2=/Central_AC

Subscribe to configured Topics
==============================

   AT+SUBSCRIBE1:raw-latex:`\n` AT+SUBSCRIBE2

Publish on configured Topics
============================

   AT+SEND1 ON:raw-latex:`\n` AT+SEND2 OFF

Publish on any non configured Topics
====================================

   AT+SEND state Hello world

Check for events
================

   AT+EVENT?

Check for messages on subscribed topics
=======================================

   AT+GET1:raw-latex:`\n` AT+GET2

Unsubscribe from subscribed Topics
==================================

   AT+UNSUBSCRIBE1:raw-latex:`\n` AT+UNSUBSCRIBE2

Disconnect from AWS IoT cloud
=============================

   AT+DISCONNECT

.. _check-connection-status-1:

Check Connection status
=======================

   AT+CONNECT?
