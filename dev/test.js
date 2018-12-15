const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

// bitcoin.createNewBlock(7876, "BJSDKNKNS0128", "KJSKLDSL88897DJ");
// bitcoin.createNewTransaction(999, "AKSHIWOEBJCS32", "PICAASDBASJB93ASD");
// bitcoin.createNewBlock(78212, "BJSDKHHNKNS0128", "KJSKKAH9LDSL88897DJ");

// bitcoin.createNewTransaction(555, "AKSHIWOEBJCS32", "PICAASDBASJB93ASD");
// bitcoin.createNewTransaction(666, "AKSHIWOEBJCS32", "PICAASDBASJB93ASD");
// bitcoin.createNewTransaction(777, "AKSHIWOEBJCS32", "PICAASDBASJB93ASD");


// bitcoin.createNewBlock(212, "BJSDKHHNKNS0128", "KJSKKAH9LDSL88897DJ");

// console.log(bitcoin);

// console.log(bitcoin.chain[2].transactions);

// console.log(bitcoin.hashBlock("HSHDSDHSDHO89823HH", [
//     {
//         amount: 22,
//         sender: 'HSKDHSDHSDKLHSD',
//         recipient: 'KSDHSDHK83JBS30KK'
//     },
//     {
//         amount: 44,
//         sender: 'aDJSKJSKDJSD320',
//         recipient: 'HSHKSFHSD923KNNKS'
//     }
// ], 38203));

// var proofWork = bitcoin.proofOfWork("HSHDSDHSDHO89823HH", [
//     {
//         amount: 22,
//         sender: 'HSKDHSDHSDKLHSD',
//         recipient: 'KSDHSDHK83JBS30KK'
//     },
//     {
//         amount: 44,
//         sender: 'aDJSKJSKDJSD320',
//         recipient: 'HSHKSFHSD923KNNKS'
//     }
// ]);

// console.log(proofWork);
// console.log(bitcoin);

const bc1 = {
    chain: [
    {
    index: 1,
    timestamp: 1544786354202,
    transactions: [ ],
    nonce: 100,
    hash: "0",
    previousBlockHash: "0"
    },
    {
    index: 2,
    timestamp: 1544786508193,
    transactions: [ ],
    nonce: 18140,
    hash: "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
    previousBlockHash: "0"
    },
    {
    index: 3,
    timestamp: 1544786557060,
    transactions: [
    {
    amount: 12.5,
    sender: "00",
    recipient: "1676c270ff9211e8a7d8c3bfc1710d50",
    transactionId: "7251ed40ff9211e8a7d8c3bfc1710d50"
    },
    {
    amount: 203,
    sender: "DSKSKDDSDOUFLCKLL908",
    recipient: "NVJDNVKJIJEWKN837SDN93",
    transactionId: "7f16f840ff9211e8a7d8c3bfc1710d50"
    },
    {
    amount: 20,
    sender: "DSKSKDDSDOUFLCKLL908",
    recipient: "NVJDNVKJIJEWKN837SDN93",
    transactionId: "87235d30ff9211e8a7d8c3bfc1710d50"
    },
    {
    amount: 30,
    sender: "DSKSKDDSDOUFLCKLL908",
    recipient: "NVJDNVKJIJEWKN837SDN93",
    transactionId: "8be37d50ff9211e8a7d8c3bfc1710d50"
    }
    ],
    nonce: 25530,
    hash: "0000d39b5397ff3605aff83c9be6a47892c5dc5d73a8d8f7aca773c7c61acfe7",
    previousBlockHash: "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
    },
    {
    index: 4,
    timestamp: 1544786625740,
    transactions: [
    {
    amount: 12.5,
    sender: "00",
    recipient: "1676c270ff9211e8a7d8c3bfc1710d50",
    transactionId: "8f61cea0ff9211e8a7d8c3bfc1710d50"
    },
    {
    amount: 40,
    sender: "DSKSKDDSDOUFLCKLL908",
    recipient: "NVJDNVKJIJEWKN837SDN93",
    transactionId: "a3d89b70ff9211e8a7d8c3bfc1710d50"
    },
    {
    amount: 50,
    sender: "DSKSKDDSDOUFLCKLL908",
    recipient: "NVJDNVKJIJEWKN837SDN93",
    transactionId: "a6c9c7f0ff9211e8a7d8c3bfc1710d50"
    },
    {
    amount: 60,
    sender: "DSKSKDDSDOUFLCKLL908",
    recipient: "NVJDNVKJIJEWKN837SDN93",
    transactionId: "ab4983b0ff9211e8a7d8c3bfc1710d50"
    },
    {
    amount: 70,
    sender: "DSKSKDDSDOUFLCKLL908",
    recipient: "NVJDNVKJIJEWKN837SDN93",
    transactionId: "aee93fb0ff9211e8a7d8c3bfc1710d50"
    }
    ],
    nonce: 240286,
    hash: "00006d282630e2aef268f1bb38fb2a28912074bf730676ab6fa440e938fb5985",
    previousBlockHash: "0000d39b5397ff3605aff83c9be6a47892c5dc5d73a8d8f7aca773c7c61acfe7"
    },
    {
    index: 5,
    timestamp: 1544786644680,
    transactions: [
    {
    amount: 12.5,
    sender: "00",
    recipient: "1676c270ff9211e8a7d8c3bfc1710d50",
    transactionId: "b8516410ff9211e8a7d8c3bfc1710d50"
    }
    ],
    nonce: 45496,
    hash: "000089aa048397a1a60644b1ceb28710a2fde50419fb626bef9f817ad3556ed3",
    previousBlockHash: "00006d282630e2aef268f1bb38fb2a28912074bf730676ab6fa440e938fb5985"
    },
    {
    index: 6,
    timestamp: 1544786649811,
    transactions: [
    {
    amount: 12.5,
    sender: "00",
    recipient: "1676c270ff9211e8a7d8c3bfc1710d50",
    transactionId: "c39bb5f0ff9211e8a7d8c3bfc1710d50"
    }
    ],
    nonce: 73971,
    hash: "0000c7460632af86547127dbf7365157b6359f98444a72003505e61a7344fd40",
    previousBlockHash: "000089aa048397a1a60644b1ceb28710a2fde50419fb626bef9f817ad3556ed3"
    }
    ],
    pendingTransactions: [
    {
    amount: 12.5,
    sender: "00",
    recipient: "1676c270ff9211e8a7d8c3bfc1710d50",
    transactionId: "c6aa2e70ff9211e8a7d8c3bfc1710d50"
    }
    ]
    };

    console.log('VALID: ', bitcoin.chainIsValid(bc1.chain));
     