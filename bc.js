
//Check metamask presence
let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
    getAccount();
} else {
    alert("You need a browser with Metamask to use xALT.")
}

pork_address = "0x9BfdB3B417F334953f94324463129cb00e6E4E87";
pork_abi = "";
user_main_address ="";
pork_contract = "";

$.getJSON("ppcontract.json", function(xab) {
    pork_abi=xab; // this will show the info it in firebug console
});



async function getAccount() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    user_main_address = account;
    start_app(account);
}

async function start_app(account) {
    pork_contract = new web3.eth.Contract(pork_abi, pork_address);

//Carico la lista degli address dei token dallo smartcontract
    chainId = await web3.eth.getChainId();
    if (chainId == 4){
        loadLastPorks();
    } else{
        await addNetwork(4);
        loadLastPorks();
    }

}

async function loadLastPorks(lastpig = 800){
    console.log("Loading porks");
    "https://gateway.pinata.cloud/ipfs/QmWvGSt2pUDRSuZc6gB6by4532SgjKv8kKiunrSijeTEpS/1.png"
    799
    798
    797

}

async function mintporks(amount=1){


    pork_contract.methods.publicSaleMint(amount)
        .send({from: user_main_address,value:web3.utils.toWei("0.01", "ether")}, function(error, transactionHash){
            console.log(error);
            console.log(transactionHash);
        });
    return false;
}


async function addNetwork(id) {
    let networkData;
    switch (id) {
//polygontest
        case 80001:
            networkData = [
                {
                    chainId: "0x13881",
                    chainName: "Polygon Testnet",
                    rpcUrls: ["https://matic-mumbai.chainstacklabs.com/"],
                    nativeCurrency: {
                        name: "MATIC",
                        symbol: "M",
                        decimals: 18,
                    },
                    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
                },
            ];
            break;

        case 4:
            networkData = [
                {
                    chainId: "0x04",
                    chainName: "Rete di test Rinkeby",
                    rpcUrls: ["https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
                    nativeCurrency: {
                        name: "ETH",
                        symbol: "E",
                        decimals: 18,
                    },
                    blockExplorerUrls: ["https://rinkeby.etherscan.io"],
                },
            ];
            break;

        default:
            break;
    }

    return window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: networkData,
    });

}

