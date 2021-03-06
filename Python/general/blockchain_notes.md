# Intro

- Static methods can neither access the object instance state nor the class state. They work like regular functions but belong to the class’s (and every instance’s) namespace.
<https://realpython.com/instance-class-and-static-methods-demystified/>

- @property is a built-in decorator for the property() function in Python. It is used to give "special" functionality to certain methods to make them act as getters, setters, or deleters when we define properties in a class.
<https://www.freecodecamp.org/news/python-property-decorator/>

- A universally unique identifier (UUID) is a 128-bit number used to identify information in computer systems.
<https://en.wikipedia.org/wiki/Universally_unique_identifier>

## Blockchain

- A blockchain is an immutable, sequential chain of records called Blocks.
<https://www.youtube.com/watch?v=SSo_EIwHSd4>
- They can contain transactions, files or any data you like, really.
- The important thing is that they’re chained together using hashes.
- Each new block contains within itself, the hash of the previous Block.
- This is crucial because it’s what gives blockchains immutability.
- If an attacker corrupted an earlier Block in the chain then all subsequent blocks will  contain incorrect hashes.
- The 1st block is called genesis block.
- A “proof” is also added to the genesis block which is the result of mining (or proof of work)
- A Proof of Work algorithm (PoW) is how new blocks are created / mined on the blockchain.
- The goal of PoW is to discover a number which solves a problem.
- The number must be difficult to find but easy to verify—computationally speaking—by anyone on the network. This is the core idea behind Proof of Work.

## How our Proof of Work (PoW) works

- Let’s decide that the hash of some integer x multiplied by another y must end in 0. So, hash(x * y) = ac23dc...0. And for this simplified example, let’s fix x = 5:

## Python immplementation

        from hashlib import sha256

        x = 5
        y = 0  # We don't know what y should be yet...

        while sha256(f'{x*y}'.encode()).hexdigest()[-1] != "0":
            y += 1
        print(f'The solution is y = {y}')

        The solution here is y = 21. Since, the produced hash ends in 0: 1253e9373e..e3600155e860

- In Bitcoin, the Proof of Work algorithm is called Hashcash.
- And it’s not too different from our basic example above.
- It’s the algorithm that miners race to solve in order to create a new block.
- In general, the difficulty is determined by the number of characters searched for in a string.
- The miners are then rewarded for their solution by receiving a coin—in a transaction.
- Mining processes all transactions and also secures the blockchain.

## Application of BlockChains in BitCoin

<https://www.buybitcoinworldwide.com/mining/>

## The Problem of Consensus

- We’ve got a basic Blockchain that accepts transactions and allows us to mine new Blocks.
- But the whole point of Blockchains is that they should be decentralized.
- And if they’re decentralized, how on earth do we ensure that they all reflect the same chain?
- This is called the problem of Consensus, and we’ll have to implement a Consensus Algorithm if we want more than one    node in our network.
- We also need a registry of nodes on the network so that the nodes know their neighbouring nodes.
- A conflict is when one node has a different chain to another node.
- To resolve this, we’ll make the rule that the longest valid chain is authoritative.
- In other words, the longest chain on the network is the de-facto one.
- Using this algorithm, we reach Consensus amongst the nodes in our network.
