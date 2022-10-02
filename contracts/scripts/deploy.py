#!/usr/bin/python3

from brownie import NFTest, accounts


def main():
    # See https://docs.biconomy.io/misc/contract-addresses for the list of trusted forwarders
    trusted_forwarder_eth = "0x84a0856b038eaAd1cC7E297cF34A7e72685A8693"
    trusted_forwarder_polygon = "0xf0511f123164602042ab2bCF02111fA5D3Fe97CD"
    trusted_forwarder_mumbai = "0x69015912AA33720b842dCD6aC059Ed623F28d9f7"

    acct = accounts.load("mumbai_test_acc")
    return NFTest.deploy(trusted_forwarder_mumbai, {'from': acct}, publish_source = True)
