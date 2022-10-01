#!/usr/bin/python3

from brownie import NFTest, accounts


def main():
    acct = accounts.load("mumbai_test_acc")
    return NFTest.deploy({'from': acct})
