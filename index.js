import Web3 from 'web3'
import moment from 'moment'
import contractJSON from './build/contracts/AravindICOContract.json'
import tokenJSON from './build/contracts/AravindTestToken.json'
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/your-api-key"));
const contract = new web3.eth.Contract(contractJSON.abi, "0xcc4de437aedb95381f6b33fc4aaafd50f1164dba")
const token = new web3.eth.Contract(tokenJSON.abi, "0x7fa2c3910277b78654ef751950311e91a3276b36")

/*Fetch all the details from contracts and update the UI*/
fetchFromContracts().then(contractData => {
   $('#loadingAnim').hide()
   !contractData.hasEnded ? $("#status").html('Aravind Token sale is open') :
       $("#status").html('Aravind Token sale has ended')
   $("#amount").append('<span>' + contractData.moneyRaised + ' Ether </span>')
   $("#supply").append('<span>' + contractData.totalSupply + ' ART </span>')
   $("#token-address").html(token._address)
   $("#token-name").html(contractData.tokenName)
   $("#token-symbol").html(contractData.tokenSymbol)
   $("#token-decimals").html(contractData.tokenDecimals)
   $("#rate").html(contractData.tokenRate)
   $("#contract-address").html(contractData.tokenOwner)
   $("#wallet-address").html(contractData.walletAddress)
   $("#countdown").countdown(contractData.endTime, function (event) {
       $(this).html(
           event.strftime(
               `<div class="timer-wrapper"><div class="time">%D</div><span class="text">days</span></div><div 
                   class="timer-wrapper"><div class="time">%H</div><span class="text">hrs</span></div><div 
                   class="timer-wrapper"><div class="time">%M</div><span class="text">mins</span></div><div 
                   class="timer-wrapper"><div class="time">%S</div><span class="text">sec</span></div>`
           )
       );
   });
});



/*Async function for red the contract properties*/
async function fetchFromContracts() {
    let dataObj = {}
    dataObj.moneyRaised = await fetchMoneyRaised();
    dataObj.endTime = await fetchEndTime();
    dataObj.totalSupply = await fetchTotalSupply();
    dataObj.walletAddress = await fetchWalletAddress();
    dataObj.tokenName = await fetchTokenName();
    dataObj.tokenSymbol = await fetchTokenSymbol();
    dataObj.tokenDecimals = await fetchTokenDecimals();
    dataObj.tokenOwner = await fetchTokenOwner();
    dataObj.tokenRate = await fetchTokenRate();
    dataObj.hasEnded = await fetchContractStatus();
    return dataObj;
 }
 
 function fetchMoneyRaised(){
    return new Promise(resolve => {
        contract.methods.weiRaised().call().then(function(etherBalance){
            resolve(web3.utils.fromWei(etherBalance, 'ether'))
        })
    })
 }
 
 function fetchEndTime() {
    return new Promise(resolve => {
        contract.methods.endTime().call().then(function(endTime){
            resolve(__WEBPACK_IMPORTED_MODULE_1_moment___default.a.unix(endTime).toDate())
        })
    })
 }
 
 function fetchTotalSupply() {
    return new Promise(resolve => {
        token.methods.totalSupply().call().then(function(totalSupply){
            resolve(web3.utils.fromWei(totalSupply, 'ether'))
        })
    })
 }
 
 function fetchWalletAddress() {
    return new Promise(resolve => {
        contract.methods.wallet().call().then(function(walletAddress){
            resolve(walletAddress)
        })
    })
 }
 
 function fetchTokenName() {
    return new Promise(resolve => {
        token.methods.name().call().then(function(tokenName){
            resolve(tokenName)
        })
    })
 }
 
 function fetchTokenSymbol() {
    return new Promise(resolve => {
        token.methods.symbol().call().then(function(symbol){
            resolve(symbol)
        })
    })
 }
 
 function fetchTokenDecimals() {
    return new Promise(resolve => {
        token.methods.decimals().call().then(function(decimals){
            resolve(decimals)
        })
    })
 }
 
 function fetchTokenOwner() {
    return new Promise(resolve => {
        token.methods.owner().call().then(function(owner){
            resolve(owner)
        })
    })
 }
 
 function fetchTokenRate() {
    return new Promise(resolve => {
        contract.methods.rate().call().then(function(rate){
            resolve(rate)
        })
    })
 }
 
 function fetchContractStatus() {
    return new Promise(resolve => {
        contract.methods.hasEnded().call().then(function(ended){
            resolve(ended)
        })
    })
 }
 
 /*Check token balance button click function to fetch balance*/
 $( document ).ready(function() {
    $("#balance").on( "click", function() {
        if(web3.utils.isAddress($("#account-num").val())) {
            token.methods.balanceOf($("#account-num").val()).call().then(function(res){
                $('#check-bal').html('<p style="font-size: 14px;color: #fff;font-weight: bold;">You have '
                    + web3.utils.fromWei(res, 'ether') + ' ART Tokens</p>')
            })
        } else {
            $('#check-bal').html(`<p style="font-size: 14px;color: #fff;font-weight: bold;">
                Please enter a valid address</p>`)
        }
    })
 });
 