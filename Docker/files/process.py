"""This is an example file."""
import os
import logging

# This is our standard LOG configuration, do not change
LOGLEVEL = os.environ.get('LOG_LEVEL', logging.INFO)
logging.basicConfig(
    format='%(asctime)s %(levelname)-8s %(message)s',
    level=LOGLEVEL,
    datefmt='%d.%m.%Y %H:%M:%S')


def process(message, config):
    '''
    This function will be called from the kafka base image.
    With the argument messega representing a dict of the whole massage.
    '''
    logging.info('This is a example file')

    print(message)
    print(config)
