import React from 'react'

export default class App extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      toParse: "",
      parsed: "",
      ding: false,
      flip: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.parseDataToJSON = this.parseDataToJSON.bind(this);
    this.parseDataToCSV = this.parseDataToCSV.bind(this);
    this.goBack = this.goBack.bind(this);
    this.flipIt = this.flipIt.bind(this);
  }
  flipIt()
  {
    this.setState({flip: !this.state.flip});
  }
  handleChange(e)
  {
    this.setState({toParse: e.target.value})
  }
  parseDataToCSV()
  {
    if(this.state.toParse=="")
      return false;
    var split = this.state.toParse;
    var split = split.replace(/(:[\ \n\t]*\{)([\s\S]*?)(},)/g, ":[objectObject],")
                     .replace(/\n/g,"")
                     .replace(/"/g,"")
                     .replace(/{/g,"").split('},');        
    var keys=[];
    var keySearch = split[0].split(",");
    console.log(keySearch);
    for(var i=0;i<keySearch.length;i++)
    {
      let keySplit = keySearch[i].split(/:[\s]*/);
      keys.push(keySplit[0]);
    }  
    console.log(keys);
    var csvString = keys.join(",") + '\n';
    for(var ii=0;ii<split.length;ii++)
    {
      let strSplit =  split[ii].split(",");
      if(ii==0)
        console.log(strSplit);
      for(var iii=0;iii<strSplit.length;iii++)
      {
        let secondSplit=strSplit[iii].split(/:[\s]*/);
        csvString+=secondSplit[1] + ",";
      }
      csvString+='\n';
    }  
    this.setState({ding: true, parsed: csvString});
  }
  parseDataToJSON()
  {
    if(this.state.toParse=="")
      return false;
    var split = this.state.toParse.split('\n');
    var keys = split[0].replace(/ /g,"_").toLowerCase().split(',');
    split.shift();
    var jsonString = "";
    for(var i=0;i<split.length;i++)
    {
      let splitRow = split[i].split(",");
      jsonString+="{";
      for(var j=0;j<splitRow.length; j++)
      {  
        jsonString+='"' + keys[j] + '": ';
        jsonString+='"' + splitRow[j] + '"';
        if(j<splitRow.length-1)
          jsonString+=",\n";
      }      
      jsonString+="}";
      if(i<split.length-1)
        jsonString+=",\n";
    }  
    this.setState({ding: true, parsed: jsonString});
  }  
  goBack()
  {
    this.setState({ding: false});
  }
  render()
  {
    return(
      <div className="fff">
      <div className="text-center container-fluid fff">
        <h1 className="down">Aww Yeah {this.state.flip
           ? "JSON to CSV!"
           : "CSV to JSON!"}</h1>
        <div>
         <button 
          className=
                 {!this.state.flip
                  ?"btn btn-primary"
                  :"btn btn-danger"}
          onClick={this.state.ding
                   ? this.goBack
                   : !this.state.flip
                   ? this.parseDataToJSON
                   : this.parseDataToCSV
                   }>
                   <h5>{! this.state.ding
                    ? "Parse!"
                     : "Edit!" }</h5></button>
        <button className=
                {!this.state.flip
                 ?"btn btn-primary"
                 :"btn btn-danger"}
                onClick={this.flipIt}><h5> Switch to 
           {this.state.flip
           ? " JSON to CSV!"
            : " CSV to JSON!"}</h5>
        </button> 
        </div>  
        <textarea
          placeholder={!this.state.flip
                      ? "Paste your CSV data here"          
                      : "Paste your JSON data here"  }
          value={!this.state.ding
                 ? this.state.toParse
                 : this.state.parsed}
          onChange={!this.state.ding
                    ? this.handleChange
                    : ""}/>  
        
      </div>  
        
      </div>  
    );
  }
}


