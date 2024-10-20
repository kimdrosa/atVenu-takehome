import logo from './logo.svg';
import './App.css';

const MOCKITEMS = [
    {name:"Poster", price: 10.00, options: [ {type: null, countIn: 12, add: 0, totalIn: 12, comp:0, countOut: 0, totalSold: 0, gross: 0} ]},
    {name:"t-shirt", price: 10.00, options:[ {type: 's', countIn: 12, add: 0, totalIn: 12, comp:0, countOut: 0, totalSold: 0, gross: 0},
                                          {type: 'm', countIn: 12, add: 0, totalIn: 12, comp:0, countOut: 0, totalSold: 0, gross: 0},
                                          {type: 'l', countIn: 12, add: 0, totalIn: 12, comp:0, countOut: 0, totalSold: 0, gross: 0}
                                        ]
    }
]


function ItemDescription({ item }) {
  //include item name image and price
  return(
    <div className="itemDescription">
      <h1>{item.name}</h1>
      <h4>{item.price}</h4>
    </div>
    )
}

function ItemCounts({ item }) {
  //render each row of counts for an item (e.g. if it has multiple sizes)
  let counts = []
  item.options.forEach((option) => {
    counts.push(
      <ItemCountsRow option={option}/>
    )
  })

  return(
    <div className="itemCounts">
    <table >
      <tr className="itemCountsRow">
        <th> count in </th>
        <th> add </th>
        <th> total in </th>
        <th> comp </th>
        <th> count out </th>
        <th> totalSold </th>
        <th> gross </th>
      </tr>
      {counts}
    </table>
    <ItemTotalsRow />
    </div>
  )
}

function ItemCountsRow({ option }){
  //render counts for an item
  return(
    <tr className="itemCountsRow">
      <td><CountInput value={{name: "countIn", val: option.countIn}}/></td>
      <td><CountInput value={{name: "add", val: option.add}}/></td>
      <td style={{color:'skyblue'}}> {option.totalIn} </td>
      <td><CountInput value={{name: "comp", val: option.comp}}/></td>
      <td><CountInput value={{name: "countOut", val: option.countOut}}/></td>
      <td style={{color:'skyblue'}}> {option.totalSold} </td>
      <td style={{color:'skyblue'}}> {option.gross} </td>
    </tr>
  )
}

function CountInput({ value }){
  //template for all of the count inputs that are changeable, gets passed value from item counts row
  return(
    <input className="countInput" type="number" id={value.name} name={value.name} defaultValue={value.val}/>
  )
}

function ItemTotalsRow(props){
  //render totals for all options for an item
}

function MerchItem({ item }) {
  //render the ItemDescription and Item Counts
  return(
    <div className="merchItem">
    <ItemDescription item={item}/>
    <ItemCounts item={item}/>
    <hr/>
    </div>
  )
}

function MerchItems({ items }){
  //render all merchItems into one component
  let rows = []

  items.forEach((item) => {
    rows.push(
      <MerchItem 
        item={item}
        key={item.name}
      />
      )
    }
  )

  return(
    <div className={"merchItems"}>
      {rows}
    </div>
  )
}

function Summary(props){
  //render summary at the bottom of the page where totals are displayed and the settle button is
}


function CountsPage() {
  //render header, MerchItems and summary
  return(
    <>
    <MerchItems items={MOCKITEMS}/>
    <Summary/>
    </>
  )
}

function App() {
  return (
   <CountsPage/>
  );
}

export default App;
