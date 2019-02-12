var sQ = (function(){
    
    /*************************************************************
        GENERAL UTILS
    *************************************************************/    
    
    var _toArray = function(item){
        return Array.from(item);
    }
    
    /*-----------------------------------------------------------*/
    
    var _isSelfQuery = function(item){
        return item instanceof SelfQuery;    
    }
    
    var _isDocument = function(item){
        return item instanceof HTMLDocument;    
    }
    
    var _isBody = function(el){
        return el instanceof HTMLBodyElement;
    }
    
    var _isNodeList = function(item){
        return NodeList.prototype.isPrototypeOf(item);
    }
    
    var _isElement = function(item){
        return item instanceof Element;
    }
    
    /* will not cover new String() obj */
    var _isString = function(item){
        return typeof(item) === "string";
    }
    
    var _isArray = function(item){
        return Array.isArray(item);
    }
    
    var _isFunction = function(item){
        return typeof(item) === "function";
    }
    
    var _isUndef = function(item){
        return typeof(item) === "undefined";
    }
    
    var _isArrayOfElements = function(item){
        if(!_isArray(item)){
            return false;
        }
        
        item.forEach((el) => {
           if(!_isElement(el)){
               return false;
           } 
        });
        
        return true;
    }
    
    /*-----------------------------------------------------------*/
    
    var _getAttribute = function(el, attribute){
        return el.getAttribute(attribute);
    }
    
    var _getClassList = function(el){
        let domTokenList = el.classList;
        
        return _toArray(domTokenList);
    }
    
    var _getId = function(el){
        return el.getAttribute('id');
    }
    
    var _getTag = function(el){
        return el.getAttribute('tag');
    }
    
    /*-----------------------------------------------------------*/
    
    var _queryAll = function(query){
        return document.querySelectorAll(query);
    }
    
    var _searchFor = function(query){
        return _toArray(_queryAll(query));
    }
    
    var _kindOf = function(query){
        if(_isString(query)){
            return _searchFor(query);
        }
        
        if(_isElement(query)){
            return [query];
        }
        
        if(_isArrayOfElements(query)){
            return query;
        }
        
        if(_isNodeList(query)){
            return _toArray(query);
        }
        
        if(_isSelfQuery(query)){
            return query.content;
        }
        
        return [window.document];
    }
    
    /*************************************************************
        CONSTRUCTOR
    *************************************************************/ 
    
    function SelfQuery(query, opt = false){
        this.content = _kindOf(query);
        
        this.load(opt);
    }
    
    SelfQuery.prototype.load = function(opt = true){
        if(opt){
            for(let i = 0; i < this.content.length; i++){
                this[i] = this.content[i];
            }
        }
    }
    
    /*************************************************************
        GENERAL UTILLS
    *************************************************************/
    
    SelfQuery.prototype.count = function(){
        return this.content.length;
    }
    
    SelfQuery.prototype.at = function(index){
        return new SelfQuery(this.content[index]);
    }
    
    SelfQuery.prototype.el = function(index){
        return this.content[index];
    }
    
    SelfQuery.prototype.first = function(){
        return new SelfQuery(this.content[0]);
    }
    
    SelfQuery.prototype.last = function(){
        return new SelfQuery(this.content[this.content.length - 1]);
    }
    
    SelfQuery.prototype.rand = function(){
        let index = Math.floor(Math.random() * this.content.length);
        
        return new SelfQuery(this.content[index]);
    }
    
    SelfQuery.prototype.push = function(item){
        let newItem = new SelfQuery(item);
        
        newItem.content.forEach((e) => {
            this.content.push(e);
        });
        
        return this;
    }
    
    SelfQuery.prototype.pop = function(){
        let oldItem = this.content.pop();
        
        return new SelfQuery(oldItem);
    }
    
    SelfQuery.prototype.unshift = function(item){
        let newItem = new SelfQuery(item);
        
        newItem.content.forEach((e) => {
            this.content.unshift(e);
        });
        
        return this;
    }
    
    SelfQuery.prototype.shift = function(){
        let oldItem = this.content.shift();
        
        return new SelfQuery(oldItem);
    }
    
    SelfQuery.prototype.concat = function(items){
        let con;
        
        if(_isArrayOfElements(items)){
            con = items;
        }
        else if(_isSelfQuery(items)){
            con = items.content;
        }
        else if(_isString(items)){
            con = new SelfQuery(items).content;
        }
        else{
            con = [];
        }
        
        this.content.concat(con);
        
        return this;
    }
    
    SelfQuery.prototype.each = function(callback, opt = true){
        if(!_isFunction(callback)){
            throw "Callback not a function";
        }
        
        for(let i = 0; i < this.content.length; i++){
            let el;
            
            if(opt){
                el = new SelfQuery(this.content[i]);
            }
            else{
                el = this.content[i];
            }
            
            callback(el, i, this);
        }
        
        return this;
    }
    
    /*************************************************************
        OTHERS UTILLS
    *************************************************************/
    
    var _getClassListArray = function(el){
        let domTokenList = el.classList;
        
        if(domTokenList.length === 0){
            return [];
        }
        
        return _toArray(domTokenList);
    }
    
    var _getClassListString = function(el){
        let arr = _getClassListArray(el);
        
        if(arr.length === 0){
            return '';
        }
        
        let cls = '';
        
        arr.forEach((cs) => {
            cls += '.' + cs;    
        });
        
        return cls;
    }
    
    var _getClassListArrayAll = function(array){
        let arr = [];
        
        array.forEach((el) => {
            arr.push(_getClassListArray(el));
        });
        
        return arr;
    }
    
    var _getClassListStringAll = function(array){
        let arr = [];
        
        array.forEach((el) => {
            arr.push(_getClassListString(el));
        });
        
        return arr;
    }
    
    SelfQuery.prototype.ClassList = function(index = -1){
        if(index >= 0 && index < this.content.length){
            return _getClassListArray(this.content[index]);
        }
        else{
            return _getClassListArrayAll(this.content);
        }
    }
    
    
    var _getId = function(el){
        let id = el.getAttribute('id');
        
        return id || '';
    }
    
    var _getIds = function(arr){
        let array = [];
        
        arr.forEach((el) => {
            array.push(_getId(el));
        });
        
        return array;
    }
    
    SelfQuery.prototype.Id = function(index = -1){
        if(index >= 0 && index < this.content.length){
            return _getId(this.content[index]);
        }
        else{
            return _getIds(this.content);
        }
    }
    
    var _getTag = function(el){
        let tag = el.tagName;
        
        return tag || '';
    }
    
    var _getTags = function(arr){
        let array = [];
        
        arr.forEach((el) => {
            array.forEach(_getTag(el));
        });
        
        return array;
    }
    
    SelfQuery.prototype.Tag = function(index = -1){
        if(index >= 0 && index < this.content.length){
            return _getTag(this.content[index]);
        }
        else{
            return _getTags(this.content);
        }
    }
    
    var _getLocalSelector = function(el){
        let sel = '';
        
        let tag = _getTag(el);
        let ids = _getId(el);
        let cls = _getClassListString(el);
        
        if(tag !== ''){
            sel += tag;
        }
        
        if(ids !== ''){
            sel += '#' + ids;
        }
        
        if(cls !== ''){
            sel += cls;
        }
        
        return sel;    
    }
    
    SelfQuery.prototype.localSelector = function(index = -1){
        if(index >= 0 && index < this.content.length){
            return _getLocalSelector(this.content[index]);
        }
        else{
            let array = [];
            
            this.content.forEach((el) => {
               array.push(_getLocalSelector(el)); 
            });
            
            return array;
        }
    }
    
    var _filther = function(array, selector){
        let arr = [];
        
        array.forEach((el) => {
            if(el.matches(selector)){
               arr.push(el);
            } 
        });
        
        return arr;
    }
    
    SelfQuery.prototype.filther = function(selector){
        return new SelfQuery(_filther(this.content, localSelector));
    }
    
    
    /*************************************************************
        QUERYING
    *************************************************************/
    
    SelfQuery.prototype.parent = function(index = -1){
        let parents = [];
        
        if(index >= 0 && index < this.content.length){
            let parent = this.content[index].parentNode;
            parents.push(parent);
        }
        else{
            this.content.forEach((el) => {
               parents.push(el.parentNode); 
            });
        }
        
        return new SelfQuery(parents);
    }
    
    SelfQuery.prototype.children = function(selector = '', index = -1){
        let children = [];
        
        if(index >= 0 && index < this.content.length){
            let kids = this.content[index].childNodes;
            
            kids.forEach((el) => {
                if(el.nodeType === 1){
                   children.push(el);
                } 
            });
        }
        else{
            this.content.forEach((el) => {
                let kids = el.childNodes;      
                kids.forEach((el) => {
                    if(el.nodeType === 1){
                       children.push(el);
                    } 
                });
            });
        }
        
        if(selector !== ''){
            let temp = _filther(children, selector);
            children = temp;
        }
        
        return new SelfQuery(children);
    }
    
    SelfQuery.prototype.siblings = function(selector = '', index = -1){
        let parent, children, skip, siblings = [];
        
        if(index >= 0 && index < this.content.length){
            skip = this.content[index];
            parent = this.content[index].parentNode;
            children = parent.childNodes;
            
            children.forEach((el) => {
                if(!el.isSameNode(skip) && el.nodeType === 1){
                    siblings.push(el);
                }
            });
        }
        else{
            this.content.forEach((el) => {
                skip = el;
                parent = el.parentNode;
                children = parent.childNodes;

                children.forEach((el) => {
                    if(!el.isSameNode(skip) && el.nodeType === 1){
                        siblings.push(el);
                    }
                });
            })
        }
        
        if(selector !== ''){
            let temp = _filther(siblings, selector);
            siblings = temp;
        }
        
        return new SelfQuery(siblings);
    }
    
    SelfQuery.prototype.find = function(selector, index = -1){
        let found = [];
        
        if(index >= 0 && index < this.content.length){
            found = _toArray(this.content[index].querySelectorAll(selector));
        }
        else{
            for(let i = 0; i < this.content.length; i++){   
                let arr = _toArray(this.content[i].querySelectorAll(selector));
                arr.forEach((el) =>{
                    found.push(el);
                });
            }
        }
        
        return new SelfQuery(found);
    }
    
    SelfQuery.prototype.closest = function(selector, index = -1){
        function _closest(el, selector){
            let parent = el.parentNode;
            
            if(parent.matches(selector)){
                return parent;
            }
            
            while(!_isBody(parent)){
                if(parent.matches(selector)){
                    return parent;
                }
                
                parent = parent.parentNode;
            }
            
            return window.document;
        }    
        
        let found = [];
        
        if(index >= 0 && index < this.content.length){
            found.push(_closest(this.content[index], selector));
        }
        else{
            this.content.forEach( (el) => {
                let elem = _closest(el, selector);
                
                if(!_isDocument(elem)){
                    found.push(elem);
                }
            });
            
            if(found.length === 0){
                found.push(window.document);
            }
        }
        
        return new SelfQuery(found);
    }
    
    /*************************************************************
        ATTRIBUTES
    *************************************************************/
    
    var _getAttributes = function(el){
        return _toArray(el.getAttributeNames());
    }
    
    var _getAttribute = function(el, name){
        return el.getAttribute(name) || '';
    }
    
    var _setAttribute = function(el, name, val){
        el.setAttribute(name, val);
    }
    
    SelfQuery.prototype.attr = function(name, val, index = -1){
        var self = this;
        
        function getAll(){
            if(index >= 0 && index < self.content.length){
                return _getAttributes(self.content[index]);
            }
            else{
                let array = [];
                
                self.content.forEach((el) => {
                    array.push(_getAttributes(el));
                });
                
                return array;
            }
        }
        
        function getOne(){
            if(index >= 0 && index < self.content.length){
                return _getAttribute(self.content[index], name);
            }
            else{
                let array = [];
                
                self.content.forEach((el) => {
                    array.push(_getAttribute(el, name));
                });
                
                return array;
            }
        }
        
        
        function setOne(){
            if(index >= 0 && index < self.content.length){
                _setAttribute(self.content[index], name, val);
            }
            else{
                self.content.forEach((el) => {
                    _setAttribute(el, name, val);
                });
            }
            
            return self;
        }
        
        if(_isUndef(name) && _isUndef(val)){
            return getAll();
        }
        
        if(_isUndef(name) && !_isUndef(val)){
            return getOne();
        }
        
        if(!_isUndef(name) && !_isUndef(val)){
            return setOne();
        }
        
        throw "No such attribute";
    }
    
    /*************************************************************
        CSS
    *************************************************************/
    
    SelfQuery.prototype.css = function(prop, val, index = -1){
        
        if(_isUndef(val)){
            return this.content[0].style[prop];
        }
        
        if(index >= 0 && index < this.content.length){
            this.content[index].style[prop] = val;
        }
        else{
            this.content.forEach(function(el){
                el.style[prop] = val;
            });
        }
        
        return this;
    }
    
    SelfQuery.prototype.jcss = function(styles, index = -1){
        
        if(index >= 0 && index < this.content.length){
            Object.keys(styles).forEach(function(key){
                this.content[index].style[key] = styles[key];
            });
        }
        else{
            this.content.forEach(function(el){
                Object.keys(styles).forEach(function(key){
                    el.style[key] = styles[key];
                });
            });
        }
        
        return this;
    }
    
    
    SelfQuery.prototype.text = function(text, index = -1){
        if(index >= 0 && index < this.content.length){
            this.content[index].textContent = text;
        }
        else{
            this.content.forEach(function(el){
                el.textContent = text;
            });
        }
        
        return this;
    }
    
    
    SelfQuery.prototype.addClass = function(classList, index = -1){
        let tempClass = classList.split(' ');
        
        let self = this;
        
        if(index >= 0 && index < this.content.length){
            tempClass.forEach(function(cls){
               self.content[index].classList.add(cls); 
            });
        }
        else{
            tempClass.forEach(function(cls){
               self.content.forEach(function(el){
                  el.classList.add(cls);  
               });
            });
        }
        
        return this;
    }
    
    SelfQuery.prototype.removeClass = function(classList, index = 0){
        let tempClass = classList.split(' ');
        let self = this;
        
        if(index >= 0 && index < this.content.length){
            tempClass.forEach(function(cls){
               self.content[index].classList.remove(cls); 
            });
        }
        else{
            tempClass.forEach(function(cls){
               self.content.forEach(function(el){
                  el.classList.remove(cls);  
               });
            });
        }
        
        return this;
    }
    
    SelfQuery.prototype.toggleClass = function(cls, index = -1){
        let self = this;
        if(index >= 0 && index < this.content.length){
           self.content[index].classList.toggle(cls); 
        }
        else{
           self.content.forEach(function(el){
              el.classList.toggle(cls);  
            });
        }
        
        return this;
    }
    
    SelfQuery.prototype.replaceClass = function(cls){
        
    }
    
    /*************************************************************
        CREATE
    *************************************************************/
    
    SelfQuery.prototype.append = function(html, index = -1){
        if(index >= 0 && index < this.content.length){
            this.content[index].insertAdjacentHTML('afterbegin', html);
        }
        else{
            this.content.forEach((el) => {
               el.insertAdjacentHTML('afterbegin', html);
            });
        }
        
        return this;
    }
    
    SelfQuery.prototype.prepend = function(){
        
    }
    
    SelfQuery.prototype.insertAfter = function(){
        
    }
    
    SelfQuery.prototype.insertBefore = function(){
        
    }
    
    SelfQuery.prototype.replace = function(){
        
    }
    
    //TODO REMOVE CERTAIN ELEMENT WITHIN
    SelfQuery.prototype.remove = function(index = -1){
        if(index >= 0 && index < this.content.length){
            this.content[index].remove();
        }
        else{
            this.content.forEach((el) => {
               el.remove();
            });
        }
        
        return this;
    }
    
    /*************************************************************
        EVENTS
    *************************************************************/
    
    SelfQuery.prototype.on = function( evt, handler, callback){
        let _callback, _handler;
        
        if(arguments.length === 2){
            _callback = arguments[1];
        }
        else{
            _handler = arguments[1];
            _callback = arguments[2];
        }
        
        this.content.forEach((el) => {
            if(!_isUndef(_handler)){
                if(this.find(_handler).count() !== 0){
                    let targets = this.find(_handler);
                    
                    targets.content.forEach((et) => {
                       et.addEventListener(evt, _callback); 
                    });
                }
            }
            else{
                el.addEventListener(evt, _callback);
            }
        });
    }
    
    /*************************************************************
        ANIMATIONS
    *************************************************************/
    
    
    
    /************************************************************/
    
    return function(query){
        return new SelfQuery(query);
    }
    
})();