var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const port = process.argv[2];
const rp = require('request-promise');

const nodeAddress = uuid().split('-').join(''); 
// uuid usually have 2 dash's - and to remove them we use this


const bitcoin = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));


app.get('/blockchain', function(req,res){
    //send back to us our entrie blockchain
    res.send(bitcoin);
});


app.post('/transaction', function(req,res){
    //to create new transaction on our blockchain
    // console.log(req.body);
    // res.send(`The amount of transaction done is ${req.body.amount} in bitcoin`);
    // const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    // res.json({note: `Transaction will be added in block ${blockIndex}.`});
    // console.log(blockIndex);
    const newTransaction = req.body;
    const blockIndex = bitcoin.addTransactionToPendingTransaction(newTransaction);
    res.json({note: `Transaction will be added in block ${blockIndex}.`});
});

app.post('/transaction/broadcast', function(req,res){
    const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    bitcoin.addTransactionToPendingTransaction(newTransaction);

    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        };
        requestPromises.push(rp(requestOptions));
    })
    Promise.all(requestPromises).then(data => {
        res.json({note: 'Transaction created and broadcasted successfully.'})
    })
})

app.get('/mine', function(req,res){
    //mine or create a new block for us
    const lastBlock = bitcoin.getLastBlock(); //step-2
    const previousBlockHash = lastBlock['hash']; //step-3
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    }    //step-5

    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData); //step-4
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce); //step-6

    // bitcoin.createNewTransaction(12.5, "00", nodeAddress);

    const newBlock = bitcoin.createNewBlock(nonce,previousBlockHash, blockHash);  //step-1

    //we loop through all pther nodes and send this block as data
    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/receive-new-block',
            method: 'POST',
            body: {newBlock: newBlock},
            json: true
        };

       requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises).then( data=>{
        const requestOptions = {
            uri: bitcoin.currentNodeUrl + '/transaction/broadcast',
            method: 'POST',
            body: {
                amount: 12.5,
                sender: '00',
                recipient: nodeAddress
            },
            json: true
        }

        return rp(requestOptions);
    }).then(data=>{
        res.json({
            note: "New block mined & broadcast successfully!",
            block: newBlock
        })
    })

    

});

app.post('/receive-new-block', (req,res)=>{
    const newBlock = req.body.newBlock;
    const lastBlock = bitcoin.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctIndex = lastBlock['index'] + 1 === newBlock['index'];
    if(correctHash && correctIndex) {
        bitcoin.chain.push(newBlock);
        bitcoin.pendingTransactions=[];
        res.json({
            note: 'New block received and accepted',
            newBlock: newBlock
        })
    } else{
        res.json({
            note: 'New Block Rejected',
            newBlock: newBlock
        })
    }
})



app.post('/register-and-broadcast-node', function(req,res){
    //register a node and broadcast it to the entire network
    const newNodeUrl = req.body.newNodeUrl;

    if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) {
        bitcoin.networkNodes.push(newNodeUrl)
    }

        const regNodesPromises = [];
    //broadcast below new network node to all other existing network nodes
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        // '/register-node' 
        const requestOptions = {
            uri: networkNodeUrl + '/register-node',
            method: 'POST',
            body: {
                newNodeUrl: newNodeUrl
            },
            json: true
        };

        regNodesPromises.push(rp(requestOptions));

        
    });

    Promise.all(regNodesPromises).then(data => {
        //use the data
        const bulkRegisterOptions = {
            uri: newNodeUrl + '/register-nodes-bulk',
            method: 'POST',
            body: {allNetworkNodes : [...bitcoin.networkNodes, bitcoin.currentNodeUrl]},
            json: true
        };

        return rp(bulkRegisterOptions);
    }).then(data => {
        res.json({note: 'New node registered with network successfully'})
    })


});

app.post('/register-node', function(req,res){
    //regioster a new node with the network
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
    if(nodeNotAlreadyPresent && notCurrentNode){bitcoin.networkNodes.push(newNodeUrl)};
    res.json({ note: 'New node registered successfully with all other nodes.'})

});


app.post('/register-nodes-bulk', function(req,res){
    //register multiple nodes at once
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl => {
        const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
        const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
        if(nodeNotAlreadyPresent && notCurrentNode){
            bitcoin.networkNodes.push(networkNodeUrl);
        };
        
        
    });
    res.json({note: 'Bulk Register Successful.'});

});

app.get('/consensus', function(req,res){
    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/blockchain',
            method: 'GET',
            json: true
        };
        requestPromises.push(rp(requestOptions));
    });
    Promise.all(requestPromises)
    .then(blockchains => {
        const currentChainLength = bitcoin.chain.length;
        let maxChainLength = currentChainLength;
        let newLongestChain = null;
        let newPendingTransactions = null;

        blockchains.forEach(blockchain => {
            if(blockchain.chain.length > maxChainLength){
                maxChainLength = blockchain.chain.length;
                newLongestChain = blockchain.chain;
                newPendingTransactions = blockchain.pendingTransactions;
            }
        });
        if(!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))){
            res.json({
                note: 'Current chain has not been replaced.',
                chain: bitcoin.chain
            })
        }
        else {
            //else if(newLongestChain && bitcoin.chainIsValid(newLongestChain)){}
            bitcoin.chain = newLongestChain;
            bitcoin.pendingTransactions = newPendingTransactions;
            res.json({
                note: 'this chain has been replaced',
                chain: bitcoin.chain
            });
        }
    })
});

app.get('/block/:blockHash', function(req,res){
    const blockHash = req.params.blockHash;
    const correctBlock = bitcoin.getBlock(blockHash);
    res.json({
        block: correctBlock
    });

});

app.get('/transaction/:transactionId', function(req,res){
    const transactionId = req.params.transactionId;
    const transactionData = bitcoin.getTransaction(transactionId);
    res.json({
        transaction: transactionData.transaction,
        block: transactionData.block
    })
    
});

app.get('/address/:address', function(req,res){
    const address = req.params.address;
    const addressData = bitcoin.getAddressData(address);
    res.json({
        addressData: addressData
    })
});

app.get('/block-explorer', function(req,res){
    res.sendFile('./block-explorer/index.html', {root: __dirname});
})

app.listen(port, function(){
    console.log(`listening on ${port}`);
});