import logo from './logo.svg';
import './App.css';
import { useState, useEffect, useRef, createContext, useContext } from 'react';

const MOCKITEMS = {
    0: {name:"Poster", price: 10.00, options: { 0:{type: null, countIn: 12, add: 0, totalIn: 12, comp:0, countOut: 2, totalSold: 0, gross: 0}}},
    1: {name:"t-shirt", price: 10.00, options:{
                                          0: {type: 's', countIn: 12, add: 0, totalIn: 12, comp:0, countOut: 0, totalSold: 0, gross: 0},
                                          1: {type: 'm', countIn: 12, add: 0, totalIn: 12, comp:0, countOut: 0, totalSold: 0, gross: 0},
                                          2: {type: 'l', countIn: 12, add: 0, totalIn: 12, comp:0, countOut: 0, totalSold: 0, gross: 0}
                                        }
    },
    2: {name:"sweatshirt", price: 15.00, options:{
                                          0: {type: 's', countIn: 12, add: 0, totalIn: 12, comp:0, countOut: 0, totalSold: 0, gross: 0},
                                          2: {type: 'l', countIn: 12, add: 0, totalIn: 12, comp:0, countOut: 0, totalSold: 0, gross: 0}
                                        }
    }
}

//context to contain state for all options for a merch item, tracks totals, price etc
const MerchItemContext = createContext()

function MerchItem({ item, merchId }) {
  const[itemId, setItemId] = useState(merchId)
  return(
    <div className="merchItem">
      <ItemDescription item={item}/>
      <ItemCounts item={item} merchId={merchId}/>
      <hr/>
    </div>
  )
}

function ItemDescription({ item }) {
  //include item name image and price
  return(
    <div className="itemDescription">
      <div>
        <h3>{item.name}</h3>
        <div className="imagePlaceholder"></div>
      </div>
      <h4 className="price">{item.price}</h4>
    </div>
    )
}

function ItemCounts({ item, merchId }) {
  //render each row of counts for an item (e.g. if it has multiple sizes)
  let counts = []
  for(const key in item.options){
    counts.push(
      <ItemCountsRow option={item.options[key]} merchId={merchId} optionId={key}  key={key}/>
    )
  }

  return(
    <div className="itemCounts">
    <table >
      <tr className="itemCountsTitles">
        <th> count in </th>
        <th> add </th>
        <th> total in </th>
        <th> comp </th>
        <th> count out </th>
        <th> totalSold </th>
        <th> gross </th>
      </tr>
      {counts}
      <ItemTotalsRow className="itemTotalsRow" merchId={merchId}/>
    </table>
    </div>
  )
}

function ItemCountsRow({ option, optionId, merchId }){
  const [countIn, setCountIn] = useState(option.countIn)
  const [add, setAdd] = useState(option.add)
  const [totalIn, setTotalIn] = useState(countIn + add)
  const [comp, setComp] = useState(option.comp)
  const [countOut, setCountOut] = useState(option.countOut)
  const [totalSold, setTotalSold] = useState(totalIn - countOut - comp)

  useEffect(() => {
    setTotalIn(parseInt(countIn) + parseInt(add))
    MOCKITEMS[merchId].options[optionId].totalIn = parseInt(countIn) + parseInt(add)
  }, [countIn, add])

  useEffect(() => {
    setTotalSold(parseInt(totalIn) - parseInt(countOut) - parseInt(comp))
    MOCKITEMS[merchId].options[optionId].totalSold = parseInt(totalIn) - parseInt(countOut) - parseInt(comp)
  }, [totalIn, countOut, comp])

  function handleCountInChange(e){
    setCountIn(e.target.value)
    MOCKITEMS[merchId].options[optionId].countIn = e.target.value
  }
  function handleAddChange(e){
    setAdd(e.target.value)
    MOCKITEMS[merchId].options[optionId].add = e.target.value
  }
  function handleCompChange(e){
    setComp(e.target.value)
    MOCKITEMS[merchId].options[optionId].comp = e.target.value
  }
  function handleCountOutChange(e){
    setCountOut(e.target.value)
    MOCKITEMS[merchId].options[optionId].countOut = e.target.value
  }

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

function ItemTotalsRow({ merchId }){
  // const [totalInSum, setTotalInSum] = useState(0)
  // const [compSum, setCompSum] = useState(0)
  // const [countOutSum, setCountOutSum] = useState(0)
  // const [totalSoldSum, setTotalSoldSum] = useState(0)
  // const [gross, setGross] = useState(0)

  const totalInSum = useRef(0)
  const compSum = useRef(0)
  const countOutSum = useRef(0)
  const totalSoldSum = useRef(0)
  const gross = useRef(0)
  const options = MOCKITEMS[merchId].options

  function calculateTotals(){
    for(const key in options){
      totalInSum.current = totalInSum.current + options[key].totalIn
      compSum.current = compSum.current + options[key].comp
      countOutSum.current = countOutSum.current + options[key].countOut
      totalSoldSum.current = totalSoldSum.current + options[key].totalSold
      gross.current = gross.current + options[key].gross
    }   
  }

  calculateTotals()

  return(
    <tr>
      <td><button>more</button></td>
      <td></td>
      <td>{totalInSum.current}</td>
      <td>{compSum.current}</td>
      <td>{countOutSum.current}</td>
      <td>{totalSoldSum.current}</td>
      <td>{gross.current}</td>
    </tr>
  )

}

function MerchItems({ items }){
  //render all merchItems into one component
  let rows = []

  for (const key in items){
    rows.push(
      <MerchItem 
        item={items[key]}
        merchId={key}
        key={key}
      />
      )
    }

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
