/**
 * Change original JS to ts
 * Parameter: CascadeClient
 */
import RestClientPromise from './cascade.client';


interface CascadeAPI{
    read();
    edit();
    delete();
}

class CascadeAPI implements CascadeAPI{

}

class CascadeFolderAPI implements CascadeAPI{
    read(){
        
    }
    edit(){

    }
    delete(){

    }
}

class CascadeFileAPI implements CascadeAPI{
    read(){

    }
    edit(){

    }
    delete(){

    }
}

class CascadeScriptFormatAPI implements CascadeAPI{
    read(){

    }
    edit(){

    }
    delete(){

    }
}

class CascadeXSLTAPI implements CascadeAPI{
    read(){
        
            }
            edit(){
        
            }
            delete(){
                
            }
}

class CascadePageAPI implements CascadeAPI{
    read(){
        
            }
            edit(){
        
            }
            delete(){
                
            }
}
