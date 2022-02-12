
//Check metamask presence
let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
    getAccount();
} else {
    alert("You need a browser with Metamask to partecipate!")
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

    lastMintedPork();
    loadStats();

}

last_pork_index = 0;
current_price = 0;
current_max_prod = 0;
next_price = 0;

async function lastMintedPork(){
        last_pork_index = await pork_contract.methods.totalSupply().call();
        console.log(last_pork_index);
        supply = last_pork_index;
        if      (supply < 100)  {current_price = 0.005; current_max_prod = 100;next_price = 0.01;}
        else if (supply < 1000) {current_price = 0.01; current_max_prod = 900;next_price = 0.02;}
        else if (supply < 2000) {current_price = 0.02; current_max_prod = 1000;next_price = 0.04;}
        else if (supply < 3000) {current_price = 0.04; current_max_prod = 1000;next_price = 0.08;}
        else if (supply < 4000) {current_price = 0.08; current_max_prod = 1000;next_price = 0.08;}
        else if (supply < 5000) {current_price = 0.08; current_max_prod = 1000;next_price = 0.1;}
        else if (supply < 6000) {current_price = 0.1; current_max_prod = 1000;next_price = 0.1;}
        else if (supply < 7000) {current_price = 0.1; current_max_prod = 1000;next_price = 0.15;}
        else if (supply < 9000) {current_price = 0.15; current_max_prod = 1000;next_price = 0.15;}
        else                    {current_price = 9;}
        return last_pork_index;
}

async function loadStats(){
    addr_balance = await web3.eth.getBalance(pork_address);
    addr_balance = Number(web3.utils.fromWei(addr_balance)).toFixed(3);
    console.log(addr_balance);
    document.getElementById('jackpot-eth').innerHTML = addr_balance + "<i class='fab fa-ethereum'></i> Locked";
    document.getElementById('pork-counter').innerHTML = current_max_prod-(last_pork_index%current_max_prod);
    document.getElementById('pork-price').innerHTML = current_price;
    document.getElementById('curr-price').innerHTML = current_price;
    document.getElementById('next-price').innerHTML = next_price;



}

async function mintporks(amount=1){


    pork_contract.methods.publicSaleMint(amount)
        .send({from: user_main_address,value:web3.utils.toWei(String(current_price*amount), "ether")}, function(error, transactionHash){
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

