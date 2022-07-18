function Validator(options){
    var selectorRules={}
    function getParent(element, selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element=element.parentElement
        }
    }

    //Ham Validate de thuc hien thay doi khi co loi
    function validate(inputElement, rule){
        var errorMessage;
        
        var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorMessage)
        var rules= selectorRules[rule.selector];

        for (var i=0; i<rules.length; i++){
            errorMessage=rules[i](inputElement.value)
            if(errorMessage) break;
        }

        if(errorMessage){
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid')
        }
        else{
            errorElement.innerText='';
        }
        return !errorMessage;
    }
    
    var formElement =document.querySelector(options.form)
    if(formElement){
        //Khi submit form
        formElement.onsubmit =function(e){
            e.preventDefault();
            var isFormSuccess=true;
            //Lap qua tung rules va validate
            options.rules.forEach((rule)=>{
                var inputElement=formElement.querySelector(rule.selector);
                 var isValid = validate(inputElement,rule)
                
                if(!isValid){
                    isFormSuccess= false;
                }
            })

            if(isFormSuccess==true   ){
                //Truong hop submit voi JS
                if(typeof options.onsubmit==='function'){
                    var enableInputs = formElement.querySelectorAll('[name]');
                    // console.log(Array.from(enableInputs)) //lay tat ca cac the co attribute la name
                    var inputValues = Array.from(enableInputs).reduce((values,input)=>{
                        return (values[input.name]=input.value)&&values;

                    },{})
                }
                //Truong hop submit voi hanh vi mac dinh
                else{
                    formElement.submit();
                }
            }
        }


        options.rules.forEach(rule=>{
            // Lưu lại các rule cho mỗi input
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
            } 
            else{
                selectorRules[rule.selector]= [rule.test]
            }

            var inputElement = formElement.querySelector(rule.selector)
            if(inputElement){
                inputElement.onblur=function(){
                    validate(inputElement,rule)
                }
                inputElement.oninput=function(){
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
        })
    }
}
// Dinh nghia Rules
// 1. Khi co loi thi hien thi thong bao loi
Validator.isRequired = function(selector,message){
    return {
        selector,
        test: function(value){
            return value.trim()? undefined: message|| "Vui lòng nhập lại trường này!"
        }
    }
}

Validator.isEmail= function(selector,message){
    return {
        selector,
        test: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value)? undefined: message|| 'Vui lòng nhập lại trường này!'
        }
    }
}

Validator.minLength= function(selector, min,message){
    return {
        selector,
        test: function(value){
            return value.length > min ? undefined:  message||'Độ dài mật khẩu chưa đủ 6 kí tự'
        }
    }
}


Validator.isConfirmed= function(selector, getConfirmValue,message){
    return {
        selector,
        test: function(value){
            return value === getConfirmValue() ? undefined: message|| 'Vui lòng nhập lại trường này'
        }
    }
}

