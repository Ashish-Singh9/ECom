const productForm=document.getElementById("addProductForm");
var addProductToDom = document.getElementById("addProductToDom");
const productNameNode = productForm.children[0].children[1];
const productPriceNode = productForm.children[2].children[1];
const productDescriptionNode = productForm.children[1].children[1];
const productQuantityNode = productForm.children[3].children[1];

function init(){
    let products=getProductsFromStorage();

    products.forEach(product => {
        appendProductToUI(product);
    });
}

init();

function resetProductForm(){
    productNameNode.value="";
    productPriceNode.value="";
    productDescriptionNode.value="";
    productQuantityNode.value="";
}

productForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    
    let productName =productNameNode.value ;
    let productDescription = productDescriptionNode.value;
    let productPrice = productPriceNode.value;
    let productQuantity = productQuantityNode.value;
    let productKey=productName+productPrice;

    let product={
        productName,
        productDescription,
        productPrice,
        productQuantity,
        productKey
    };

    let isValid=validateInputs(product);
    if(!isValid.status)
    {
        alert(isValid.message)
        return;
    }
    resetProductForm();
    saveProductToStorage(product);
    appendProductToUI(product);
})

function searchProduct(productKey){
    let products=getProductsFromStorage();
    let obj={
        status:false,
        index:-1
    };

    if(products.length==0)
    return obj;
    for(let i=0;i<products.length;i++)
    {
        if(products[i].productKey==productKey)
        {
            obj.status=true;
            obj.index=i;
            return obj;
        }
    }
    return obj;
}

function validateInputs(product){
    let {
        productName, 
        productDescription, 
        productPrice,
        productQuantity,
        productKey
         
    }=product;
    let isProductExistOrNot=searchProduct(productKey);

    if(isProductExistOrNot.status)
    {
        return {
            status:false,
            message:"Product Already Exist!!"
        };
    }

    if(productPrice < 0 )
    {
        console.log("-ve");
        return {
            status: false,
            message:"Price can not be Negetive!!"
        }
    }
    if(!productName)
    {
        return {
            status: false,
            message:"name is missing"
        }
    }

    if(!productDescription)
    {
        return {
            status: false,
            message:"description is missing"
        }
    }

    if(!productPrice )
    {
        
        return {
            status: false,
            message:"price is missing"
        }
    }
    
    if(!productQuantity)
    {
        return {
            status: false,
            message:"quantity is missing"
        }
    }

    return {
        status: true,
    }
}
//update Product array to local storage
function upDateProductToStorage(products){
    localStorage.setItem("products",JSON.stringify(products));
}
//save product array to Local storage
function saveProductToStorage(product)
{
    let products=getProductsFromStorage();
    products.push(product);
    localStorage.setItem("products",JSON.stringify(products));
}
//function to get product array from storage
function getProductsFromStorage(){
    let products=localStorage.getItem("products");

    return products? JSON.parse(products):[];
}

function appendProductToUI(product){

    let {
        productName,
        productDescription,
        productQuantity,
        productPrice,
        productKey
    }=product;


    let card=document.createElement("div");
        card.classList.add("card");


    let divImg=document.createElement("div");
        divImg.classList.add("img");
    let divProductDetails=document.createElement("productDetails");
        divProductDetails.classList.add("productDetails");
    let divPro=document.createElement("div");
        divPro.setAttribute("id","pro");


    let divName=document.createElement("div");
    let divDesc=document.createElement("div");
    let divPrice=document.createElement("div");
    let divQuantity=document.createElement("div");


    let labelName=document.createElement("label");
        labelName.setAttribute("for","productName");
        labelName.innerText="Product Name";
    let labelDesc=document.createElement("label");
        labelDesc.setAttribute("for","productDescription");
        labelDesc.innerText="Product Desc"
    let labelPrice=document.createElement("label");
        labelPrice.setAttribute("for","productPrice");
        labelPrice.innerText="Product Price"
    let labelQuantity=document.createElement("label");
        labelQuantity.setAttribute("for","ProductQuantity");
        labelQuantity.innerText="Product Quantity"

    let inputName=document.createElement("input");
        inputName.setAttribute("type","text");
        inputName.disabled=true;
        inputName.value=productName;
    let inputDesc=document.createElement("input");
        inputDesc.setAttribute("type","text");
        inputDesc.disabled=true;
        inputDesc.value=productDescription;
    let inputPrice=document.createElement("input");
        inputPrice.setAttribute("type","number");
        inputPrice.disabled=true;
        inputPrice.value=productPrice;
    let inputQuantity=document.createElement("input");
        inputQuantity.setAttribute("type","number");
        inputQuantity.disabled=true;
        inputQuantity.value=productQuantity;

    let inputObj={
        inputName,
        inputDesc,
        inputPrice,
        inputQuantity
    };
        
    divName.append(labelName);
    divName.append(inputName);
    divDesc.append(labelDesc);
    divDesc.append(inputDesc);
    divPrice.append(labelPrice);
    divPrice.append(inputPrice);
    divQuantity.append(labelQuantity);
    divQuantity.append(inputQuantity);

    divPro.append(divName);
    divPro.append(divDesc);
    divPro.append(divPrice);
    divPro.append(divQuantity);
    
    divProductDetails.append(divPro);

    let divBtn=document.createElement("div");
    divBtn.classList.add("btn");
    let divbtnMain=document.createElement("div");
        divbtnMain.classList.add("btnShow");
    let divbtnSave=document.createElement("div");
        divbtnSave.classList.add("hide");

    let divbtnObj={
        divbtnMain,
        divbtnSave
    };

    let btnUpdate=document.createElement("button");
        btnUpdate.style.backgroundColor="blue";
        btnUpdate.innerText="Update";
    let btnDelete=document.createElement("button");
        btnDelete.innerText="Delete";
        btnDelete.style.backgroundColor="red";
    let btnSave=document.createElement("button");
        btnSave.innerText="Save";
        btnSave.style.backgroundColor="green";

    btnUpdate.addEventListener('click',()=>{
        
        updateProduct(divbtnObj,inputObj);
    });

    btnDelete.addEventListener('click',(e)=>{
        deleteProduct(e,productKey);
    });

    btnSave.addEventListener('click',()=>{
        
        saveUpdateProduct(inputObj,divbtnObj,productKey);
    });

    divbtnMain.append(btnUpdate);
    divbtnMain.append(btnDelete);

    divbtnSave.append(btnSave);

    divBtn.append(divbtnMain);
    divBtn.append(divbtnSave);

    card.append(divImg);
    card.append(divProductDetails);
    card.append(divBtn);
    
    addProductToDom.append(card);

}
//helper function updateProduct
function enableInputBtn(inputObj){
    inputObj.inputName.disabled=false;    
    inputObj.inputDesc.disabled=false;
    inputObj.inputPrice.disabled=false;        
    inputObj.inputQuantity.disabled=false;
}
//helper function saveProduct
function disableInputBtn(inputObj){
    inputObj.inputName.disabled=true;    
    inputObj.inputDesc.disabled=true;
    inputObj.inputPrice.disabled=true;        
    inputObj.inputQuantity.disabled=true;
}

function updateProduct(divbtnObj,inputObj){

    let mainButtonContainer=divbtnObj.divbtnMain;
        mainButtonContainer.classList.add("hide");
        mainButtonContainer.classList.remove("btnShow");
    let saveButtonContainer=divbtnObj.divbtnSave;
        saveButtonContainer.classList.remove("hide");
        saveButtonContainer.classList.add("btnShow");
        
    enableInputBtn(inputObj);    

}

function deleteProduct(e,productKey){

    console.log(e.target.parentElement.parentElement.parentElement);
    let isProductExistOrNot=searchProduct(productKey);
    let index=isProductExistOrNot.index;
    
    if(isProductExistOrNot)
    {
        deleteFromStorage(index);
        deleteFromDom(e.target.parentElement.parentElement.parentElement);
    }   

}
function deleteFromDom(e){
 
   e.remove();
}
function deleteFromStorage(index){
    let products=getProductsFromStorage();
 
    products.splice(index, 1);
 
    upDateProductToStorage(products);
}

function saveUpdateProduct(inputObj,divbtnObj,productKey){

    let isProductExist=searchProduct(productKey);
    let products=getProductsFromStorage();
    if(isProductExist.status)
    {
        let index=isProductExist.index;
        let updatedProductName=inputObj.inputName.value;
        let updatedProductDesc=inputObj.inputDesc.value;
        let updatedProductPrice=inputObj.inputPrice.value;
        let updatedProductQunatity=inputObj.inputQuantity.value
        let updatedProductKey=updatedProductName+updatedProductPrice;
       
        products[index].productName=updatedProductName;
        products[index].productDescription=updatedProductDesc;
        products[index].productPrice=updatedProductPrice;
        products[index].productQuantity=updatedProductQunatity;
        products[index].productKey=updatedProductKey;
       
    }
    upDateProductToStorage(products);

    disableInputBtn(inputObj);   
    let mainButtonContainer=divbtnObj.divbtnMain;
        mainButtonContainer.classList.remove("hide");
        mainButtonContainer.classList.add("btnShow");
    let saveButtonContainer=divbtnObj.divbtnSave;
        saveButtonContainer.classList.add("hide");    
        saveButtonContainer.classList.remove("btnShow");          
}
