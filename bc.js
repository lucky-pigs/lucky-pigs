
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



function loadPork1(id){

    document.getElementById('price_p1').innerHTML = current_price;
    document.getElementById('name_p1').innerHTML = "Lucky Pig #"+id;
    document.getElementById("img_p1").src="https://gateway.pinata.cloud/ipfs/QmNTeaChpaBFNdWrtBDoZAixRnTRZAuafGistucdGKj7YS/"+id+".png";
    document.getElementById("button_p1").onclick = "window.open('https://testnets.opensea.io/assets/0x9BfdB3B417F334953f94324463129cb00e6E4E87/"+id+"','_blank')";

}

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
        if      (supply < 100)  {current_price = 1; current_max_prod = 100;next_price = 5;}
        else if (supply < 1000) {current_price = 5; current_max_prod = 900;next_price = 10;}
        else if (supply < 2000) {current_price = 10; current_max_prod = 1000;next_price = 20;}
        else if (supply < 3000) {current_price = 20; current_max_prod = 1000;next_price = 50;}
        else if (supply < 4000) {current_price = 50; current_max_prod = 1000;next_price = 100;}
        else if (supply < 5000) {current_price = 100; current_max_prod = 1000;next_price = 200;}
        else if (supply < 6000) {current_price = 200; current_max_prod = 1000;next_price = 250;}
        else if (supply < 7000) {current_price = 250; current_max_prod = 1000;next_price = 400;}
        else if (supply < 8000) {current_price = 400; current_max_prod = 1000;next_price = 500;}
        else                    {current_price = 500;current_max_prod = 888;next_price = 500;}
        return last_pork_index;
}

async function loadStats(){
    addr_balance = await web3.eth.getBalance(pork_address);
    addr_balance = Number(web3.utils.fromWei(addr_balance)).toFixed(3);
    console.log(addr_balance);
    document.getElementById('jackpot-eth').innerHTML = addr_balance + "<svg fill=\"gray\" viewBox=\"0 0 20 20\" style=\"width: 20px;\"><path d=\"M7.95515 6.10224C7.9453 6.03817 7.927 5.9763 7.90407 5.91551C7.86843 5.82096 7.81455 5.73727 7.75076 5.65842C7.68196 5.57329 7.59428 5.51057 7.50182 5.45292C7.48675 5.45142 7.47426 5.44422 7.46154 5.43679C7.24105 5.30829 7.02137 5.17842 6.80124 5.04934C6.50042 4.87296 6.20003 4.69571 5.89877 4.51997C5.77419 4.44726 5.63785 4.40801 5.49321 4.39239C5.32585 4.37433 5.16629 4.39852 5.01312 4.46502C4.95043 4.49221 4.89251 4.52824 4.83335 4.56178C4.5287 4.73431 4.22361 4.90592 3.91881 5.07824C3.7178 5.19191 3.51414 5.30151 3.31599 5.41967C3.05287 5.57651 2.89154 5.8017 2.85508 6.10452C2.85141 6.13535 2.84943 6.16596 2.84943 6.19686C2.8495 6.82113 2.84479 7.44541 2.85141 8.06961C2.85479 8.38885 3.00186 8.6428 3.28174 8.81383C3.58021 8.99621 3.88471 9.16925 4.18635 9.34663C4.42411 9.48649 4.66195 9.6262 4.89993 9.7657C5.07802 9.87009 5.2733 9.91404 5.48005 9.90291C5.63822 9.89442 5.78205 9.84176 5.9178 9.76127C6.28779 9.54186 6.66079 9.3273 7.03247 9.11067C7.05018 9.10039 7.06723 9.0884 7.08876 9.08648C7.19379 9.02476 7.29867 8.96289 7.40378 8.90139C7.58443 8.79571 7.7645 8.68918 7.94619 8.58522C8.04269 8.52999 8.14221 8.47968 8.24032 8.4271C8.44825 8.31564 8.65639 8.20454 8.86402 8.09245C9.1561 7.93475 9.44995 7.78027 9.73629 7.61259C10.0202 7.44626 10.3086 7.287 10.5944 7.12353C10.8577 6.9729 11.1196 6.81985 11.3833 6.66993C11.4905 6.60893 11.5952 6.54242 11.7168 6.50817C11.7778 6.49098 11.8394 6.47813 11.9015 6.46636C11.9135 6.46044 11.9276 6.46779 11.9395 6.4608C11.9513 6.46022 11.9632 6.45965 11.975 6.45908C12.0189 6.45551 12.0628 6.45523 12.1067 6.45923C12.2985 6.47136 12.4628 6.55341 12.6237 6.64696C12.8177 6.75977 13.0144 6.86823 13.2098 6.97861C13.5218 7.15486 13.8336 7.33153 14.1459 7.50741C14.416 7.65961 14.6878 7.80917 14.9569 7.96308C15.1872 8.0948 15.4268 8.21225 15.6466 8.36002C15.8622 8.50494 15.9909 8.70894 16.0318 8.96254C16.0339 8.97531 16.0373 8.98794 16.0401 9.00064C16.0455 9.0127 16.0391 9.02633 16.0454 9.03831C16.0453 9.06678 16.0453 9.09533 16.0453 9.1238C16.0453 10.2829 16.0453 11.4421 16.0453 12.6012C16.0453 12.8844 15.939 13.1222 15.7225 13.3122C15.6406 13.3841 15.5419 13.4315 15.4475 13.4852C15.2718 13.5852 15.0963 13.6852 14.9202 13.7846C14.7787 13.8643 14.6363 13.9426 14.4948 14.0224C14.2852 14.1406 14.0764 14.2602 13.8666 14.3782C13.6307 14.511 13.3938 14.6422 13.1579 14.775C12.9503 14.8919 12.7437 15.0104 12.5362 15.1275C12.4817 15.1583 12.4247 15.1843 12.3656 15.2057C12.3221 15.2213 12.2778 15.2303 12.2303 15.2296C12.0968 15.2275 11.963 15.2236 11.8299 15.2306C11.7191 15.2363 11.6286 15.1927 11.5383 15.1433C11.4217 15.0794 11.3064 15.0133 11.1907 14.9479C11.0778 14.8841 10.965 14.8201 10.8522 14.7563C10.7395 14.6925 10.6269 14.6285 10.514 14.565C10.4001 14.5008 10.2856 14.4374 10.1715 14.3734C10.0556 14.3083 9.93981 14.2431 9.82405 14.1777C9.71116 14.114 9.59863 14.0498 9.48567 13.9861C9.35212 13.9109 9.21814 13.8364 9.08459 13.7611C8.94384 13.6818 8.80332 13.6022 8.66286 13.5225C8.57297 13.4715 8.47993 13.4255 8.39592 13.3652C8.24356 13.2559 8.13228 13.1164 8.06437 12.9438C8.03813 12.8771 8.02152 12.8089 8.01248 12.7386C8.00609 12.7245 8.01447 12.7085 8.00682 12.6946C8.00668 12.2773 8.00697 11.86 8.00572 11.4427C8.00565 11.4089 8.01674 11.3914 8.0471 11.3744C8.28942 11.2394 8.53027 11.1018 8.77201 10.9657C8.96824 10.8553 9.165 10.7457 9.3616 10.6358C9.3924 10.6185 9.42341 10.6016 9.46251 10.58C9.46251 10.7259 9.46251 10.8654 9.46251 11.0048C9.47567 11.0204 9.47089 11.0389 9.47097 11.0563C9.47133 11.3012 9.46862 11.5462 9.472 11.7911C9.47486 11.9991 9.5502 12.183 9.6836 12.3457C9.77833 12.4613 9.90526 12.5344 10.0338 12.6065C10.2661 12.7367 10.4975 12.8682 10.7295 12.9988C11.0101 13.1569 11.2888 13.3184 11.572 13.4722C11.6879 13.5353 11.8166 13.5662 11.9502 13.5797C12.0924 13.5941 12.228 13.5731 12.3614 13.5278C12.4079 13.5119 12.4517 13.4905 12.4937 13.4663C12.8508 13.2605 13.2071 13.0539 13.5638 12.8475C13.7499 12.7398 13.9399 12.6381 14.1206 12.522C14.3586 12.3691 14.4961 12.1519 14.5347 11.8773C14.5412 11.8306 14.5451 11.7831 14.545 11.7353C14.5444 11.1325 14.5461 10.5296 14.5439 9.92681C14.543 9.67301 14.4492 9.45324 14.265 9.27186C14.1877 9.19572 14.0926 9.14335 13.998 9.0904C13.7179 8.93371 13.439 8.77502 13.1594 8.61747C12.9254 8.48561 12.6953 8.34654 12.4565 8.22331C12.1611 8.07097 11.8553 8.05299 11.5512 8.20433C11.4216 8.26883 11.2985 8.34525 11.1726 8.41632C10.7883 8.63331 10.4041 8.85022 10.0201 9.06757C9.67838 9.26094 9.33581 9.45288 8.99441 9.64675C8.97927 9.65531 8.96281 9.65817 8.947 9.66366C8.84587 9.7196 8.74459 9.77519 8.64368 9.83156C8.50499 9.90905 8.36652 9.98704 8.22805 10.065C7.99852 10.1944 7.76898 10.3239 7.53953 10.4534C7.31756 10.5787 7.09567 10.7041 6.87371 10.8294C6.66241 10.9488 6.45103 11.0682 6.23972 11.1876C6.11103 11.2604 5.98439 11.337 5.85312 11.4051C5.7481 11.4596 5.63366 11.4918 5.51459 11.5057C5.50225 11.511 5.48821 11.5045 5.47601 11.5109C5.45212 11.5115 5.42823 11.5122 5.40435 11.5129C5.39229 11.5161 5.38024 11.5163 5.36826 11.5127C5.34687 11.5121 5.32541 11.5114 5.30402 11.5109C5.29182 11.5044 5.27771 11.5112 5.26536 11.5055C5.23383 11.5002 5.20223 11.4949 5.1707 11.4895C5.123 11.49 5.08074 11.4704 5.03818 11.4536C4.9186 11.4063 4.81203 11.3354 4.7009 11.2731C4.32776 11.0642 3.95564 10.8536 3.583 10.6437C3.31518 10.4929 3.04743 10.3419 2.77975 10.1908C2.47084 10.0164 2.1598 9.84547 1.8528 9.66794C1.61849 9.53244 1.46282 9.33622 1.39991 9.07513C1.39094 9.03789 1.38859 9.00014 1.38859 8.96211C1.38675 8.94627 1.39248 8.92986 1.38477 8.91437C1.38477 7.71577 1.38477 6.51709 1.38477 5.31849C1.39248 5.30714 1.38682 5.29451 1.38859 5.2826C1.39123 5.13704 1.44871 5.00974 1.52926 4.89094C1.60717 4.77613 1.71521 4.69536 1.83803 4.62821C2.07167 4.50049 2.3015 4.36613 2.53302 4.23484C2.88191 4.0369 3.23058 3.83861 3.57933 3.64046C4.03891 3.3793 4.49886 3.11836 4.95822 2.85664C5.0229 2.81975 5.09353 2.79548 5.16519 2.77436C5.18062 2.7698 5.19657 2.76965 5.21252 2.76965C5.37171 2.76965 5.53098 2.7693 5.69018 2.7698C5.76956 2.77008 5.83681 2.80719 5.902 2.84401C6.18467 3.00348 6.46639 3.16467 6.7481 3.32579C6.91266 3.4199 7.07759 3.51359 7.24245 3.60728C7.25421 3.61391 7.26597 3.62019 7.27163 3.63318C7.39576 3.70503 7.51953 3.77746 7.64404 3.84867C7.93509 4.01535 8.22621 4.18182 8.51778 4.34765C8.67925 4.43948 8.84418 4.52589 9.00044 4.626C9.19814 4.75272 9.32706 4.9304 9.391 5.15174C9.40342 5.19469 9.4093 5.23943 9.4182 5.28331C9.42444 5.29773 9.41665 5.31378 9.42371 5.32805C9.42356 5.35295 9.42334 5.37786 9.42334 5.40276C9.42334 5.80434 9.42312 6.20592 9.42386 6.60757C9.42393 6.63404 9.41695 6.6481 9.3913 6.66208C9.25922 6.73429 9.12935 6.81029 8.99816 6.884C8.86696 6.95778 8.73489 7.02999 8.6037 7.10369C8.39437 7.22136 8.1855 7.33966 7.97639 7.45775C7.97066 7.45925 7.96677 7.45711 7.96625 7.45147C7.96522 7.44084 7.96581 7.43014 7.96581 7.41944C7.96581 7.01457 7.96581 6.60971 7.96566 6.20485C7.96566 6.192 7.96875 6.17873 7.9625 6.16625C7.96199 6.15711 7.9614 6.14798 7.96089 6.13892C7.95479 6.12729 7.96258 6.11359 7.95515 6.10224Z\"></path></svg> Locked";
    document.getElementById('pork-counter').innerHTML = current_max_prod-(last_pork_index%current_max_prod);
    document.getElementById('pork-price').innerHTML = current_price;
    document.getElementById('curr-price').innerHTML = current_price;
    document.getElementById('next-price').innerHTML = next_price;



}

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

async function mintporks(amount=1){

    friend = findGetParameter("friend");

    if (friend.length > 0){
        mintporkswithfriends(amount,friend);
    }
    else {
        pork_contract.methods.publicSaleMint(amount)
            .send({
                from: user_main_address,
                value: web3.utils.toWei(String(current_price * amount), "ether")
            }, function (error, transactionHash) {
                console.log(error);
                console.log(transactionHash);
            });
    }
    return false;
}

async function mintporkswithfriends(amount=1, friend){


    pork_contract.methods.saleAndGift(amount,friend)
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
                    chainId: "0x4",
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

