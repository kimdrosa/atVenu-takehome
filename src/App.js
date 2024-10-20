import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

const MOCKITEMS = [
    {name:"Poster", price: 10.00, options: [ {type: null, countIn: 12, add: 0, totalIn: 12, comp:0, countOut: 2, totalSold: 0, gross: 0} ]},
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
  const [countIn, setCountIn] = useState(option.countIn)
  const [add, setAdd] = useState(option.add)
  const [totalIn, setTotalIn] = useState(countIn + add)
  const [comp, setComp] = useState(option.comp)
  const [countOut, setCountOut] = useState(option.countOut)
  const [totalSold, setTotalSold] = useState(totalIn - countOut - comp)
  //render counts for an item
// Total In = count in + add
// Total Sold = Total In - count out - comp
  function handleCountInChange(e){
    setCountIn(e.target.value)
    setTotalIn(countIn + add)
    setTotalSold(totalIn - countOut - comp)
  }
  function handleAddChange(e){
    setAdd(e.target.value)
    setTotalIn(countIn + add)
    setTotalSold(totalIn - countOut - comp)

  }
  function handleCompChange(e){
    setComp(e.target.value)
    setTotalIn(countIn + add)
    setTotalSold(totalIn - countOut - comp)
  }
  function handleCountOutChange(e){
    setCountOut(e.target.value)
    setTotalIn(countIn + add)
    setTotalSold(totalIn - countOut - comp)
  }



  //pass down an onChange function that updates all the values in this level through state

  return(
    <tr className="itemCountsRow">
      <td><CountInput count={{name: "countIn", val: countIn}} onChange={handleCountInChange}/></td>
      <td><CountInput count={{name: "add", val: add}} onChange={handleAddChange}/></td>
      <td style={{color:'skyblue'}}> {totalIn} </td>
      <td><CountInput count={{name: "comp", val: comp}} onChange={handleCompChange}/></td>
      <td><CountInput count={{name: "countOut", val: countOut}} onChange={handleCountOutChange}/></td>
      <td style={{color:'skyblue'}}> {totalSold} </td>
      <td style={{color:'skyblue'}}> {option.gross} </td>
    </tr>
  )
}

function CountInput({ count, onChange }){
  //template for all of the count inputs that are changeable, gets passed value from item counts row
 
  return(
    <input className="countInput" type="number" id={count.name} name={count.name} defaultValue={count.val} onChange={onChange}/>
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
