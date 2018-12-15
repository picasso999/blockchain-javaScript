const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');

function Blockchain (){
    this.chain = [];

    this.pendingTransactions = [];

    this.currentNodeUrl = currentNodeUrl; //this is to know which url node it is coming from
    this.networkNodes = []; //every node will be aware of all other ndoes inside our blockchain network

    this.createNewBlock(100, '0', '0');
}

// We can use classes also instead of direct constrcutor as done above. 

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash){
    const newBlock = {
        // this is going to be a new block in our chain, inside of our blockchain, all the data we need will be stored inside of this blockchain.//#endregion

        index: this.chain.length + 1, //in which position the block is in the chain of events
        timestamp: Date.now(),
        transactions: this.pendingTransactions, //when we create new block, all the new and depending transactions put it in here for easy hashing
        nonce: nonce, //paremeter we passed in this function, its a proof of work, its a number
        hash: hash, //the data for our new block, all the data transactions will be compressed into single striong, that will be our hash
        previousBlockHash: previousBlockHash //data from the previous block coded into hash and sent to present block in the chain.
    }

    this.pendingTransactions = []; //the information is made empty from the previpus block so that it can be used for next block
    this.chain.push(newBlock); // this will take our new block and push it into our chain for stroing data and for further use

    return newBlock;

    //basically, creatNewBlock will create new block with the informationwe have mentioned an the information is sent into chain pof blocks and later when needed to be used for checking proper transactions, can be retreeived easily from the fool rpoof method.
}

Blockchain.prototype.getLastBlock = function(){
    return this.chain[this.chain.length - 1]; //this is get previous block ifnromation details
}

Blockchain.prototype.createNewTransaction = function(amount, sender, recipient){
    //this is created to save information about how much amount and who is sendign to whom. 
    const newTransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient,
        transactionId: uuid().split('-').join('')
    };
    return newTransaction;

    // this.pendingTransactions.push(newTransaction);

    // return this.getLastBlock()['index'] + 1; //returning the number of the block to which the transaction will be added to
};

Blockchain.prototype.addTransactionToPendingTransaction = function(transactionObj){
    this.pendingTransactions.push(transactionObj);
    return this.getLastBlock()['index'] +1;
}

Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce){
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    return hash;
}

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData){
    // => repeatedly hash block untol it finds correct hash => 'SDSJKSHKSDJHSDJKHSDKJHSD'
    // => uses current block data for the hash, but also the previousBlockHash
    // => continously changes nonce value until it finds the correct hash
    // => returns to us the nonce value that creats the correct hash

    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (hash.substring(0,4) !== '0000'){
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);

    }
    return nonce;
}

Blockchain.prototype.chainIsValid = function(blockchain){
    let validChain = true;
    
    for(var i = 1; i<blockchain.length; i++){
        const currentBlock = blockchain[i];
        const prevBlock = blockchain[i-1];
        const blockHash = this.hashBlock(prevBlock['hash'], {transactions: currentBlock['transactions'], index: currentBlock['index']}, currentBlock['nonce']);

        if(blockHash.substring(0,4) !== '0000'){
            validChain = false;
        };

        if(currentBlock['previousBlockHash'] !== prevBlock['hash']) // chain not valid
        {
            validChain = false;
        }
    }

    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock['nonce'] === 100;
    const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
    const correctHash = genesisBlock['hash'] === '0';
    const correctTransactions = genesisBlock['transactions'].length === 0;

    if(!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions){
        validChain = false;
    }

    return validChain;
};

Blockchain.prototype.getBlock = function(blockHash){
    let correctBlock = null;
    this.chain.forEach(block => {
        if(block.hash === blockHash){
            correctBlock = block;
        }
    });
    return correctBlock;
};

Blockchain.prototype.getTransaction = function(transactionId){
    
    let correctTransaction = null;
    let correctBlock = null;

    this.chain.forEach(block => {
        block.transactions.forEach(transaction => {
            if(transaction.transactionId === transactionId){
                correctTransaction = transaction;
                correctBlock = block;
            }
        })
    });
    return {
        transaction: correctTransaction,
        block: correctBlock
    }
};

Blockchain.prototype.getAddressData = function(address){
    const addressTransactions = [];
    this.chain.forEach(block=>{
        block.transactions.forEach(transaction => {
            if(transaction.sender === address || transaction.recipient === address){
                addressTransactions.push(transaction);
            }
        })
    })

    let balance = 0;
    addressTransactions.forEach(transaction => {
        if(transaction.recipient === address){
            balance += transaction.amount;
        } else if(transaction.sender === address){
            balance -= transaction.amount;
        }
    })
    return {
        addressTransactions: addressTransactions,
        addressBalance: balance
    
    }
}

module.exports = Blockchain;