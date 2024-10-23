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

const MerchItemContext = createContext()

function MerchItem({ merchItem, merchId }) {
  const[totals, setTotals] = useState({totalIn: 0, comp: 0, countOut: 0, totalSold: 0, gross: 0})
  const[item, setItem] = useState(merchItem)
  const[price, setPrice] = useState(item.price)

  const options = item.options

  useEffect(() => {
    calculateTotals()
  },[item])

  function calculateTotals(){
    let totalInSum = 0
    let compSum = 0
    let countOutSum = 0
    let totalSoldSum = 0
    let grossSum = 0 

    for(const key in options){
        totalInSum += parseInt(options[key].totalIn)
        compSum += parseInt(options[key].comp)
        countOutSum += parseInt(options[key].countOut)
        totalSoldSum += parseInt(options[key].totalSold)
        grossSum += parseInt(options[key].gross)
      }

    setTotals({totalIn:totalInSum, comp: compSum, countOut: countOutSum, totalSold: totalSoldSum, gross:grossSum})
  }

  return(
    <MerchItemContext.Provider value={{item, setItem, totals, price, setPrice}}>
      <div className="merchItem">
        <ItemDescription item={item}/>
        <ItemCounts item={item} merchId={merchId}/>
        <hr/>
      </div>
    </MerchItemContext.Provider>
  )
}

function ItemDescription({ item }) {
  const { price } = useContext(MerchItemContext)
  return(
    <div className="itemDescription">
      <div>
        <h3>{item.name}</h3>
        <div className="imagePlaceholder"></div>
      </div>
      <h4 className="price">${price.toFixed(2)}</h4>
    </div>
    )
}

function ItemCounts({ item, merchId }) {
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
        <th> total sold </th>
        <th> gross </th>
      </tr>
      {counts}
      <ItemTotalsRow className="itemTotalsRow" merchId={merchId}/>
    </table>
    </div>
  )
}

function ItemCountsRow({ option, optionId, merchId }){
  const { totals, item, setItem, price } = useContext(MerchItemContext)
  const [countIn, setCountIn] = useState(option.countIn)
  const [add, setAdd] = useState(option.add)
  const [totalIn, setTotalIn] = useState(countIn + add)
  const [comp, setComp] = useState(option.comp)
  const [countOut, setCountOut] = useState(option.countOut)
  const [totalSold, setTotalSold] = useState(totalIn - countOut - comp)
  const [gross, setGross] = useState(price * totalSold)

  useEffect(() => {

    setTotalIn(parseInt(countIn) + parseInt(add))
    option.totalIn = parseInt(countIn) + parseInt(add)

    setTotalSold(parseInt(totalIn) - parseInt(countOut) - parseInt(comp))
    option.totalSold = parseInt(totalIn) - parseInt(countOut) - parseInt(comp)

    setGross(totalSold * price)
    option.gross = totalSold * price

    let tempOptions = {}

    for(const key in item.options){
      tempOptions[key] = item.options[key]
    }

    tempOptions[optionId] = option

    setItem({
      name: item.name,
      price: price,
      options: tempOptions
    })
   },[price, countIn, add, totalIn, comp, countOut, totalSold, gross])

  function handleCountInChange(e){
    setCountIn(e.target.value || 0)
    option.countIn = e.target.value
  }
  function handleAddChange(e){
    setAdd(e.target.value || 0)
    option.add = e.target.value
  }
  function handleCompChange(e){
    setComp(e.target.value || 0)
    option.comp = e.target.value
  }
  function handleCountOutChange(e){
    setCountOut(e.target.value || 0)
    option.countOut = e.target.value
  }

  return(
    <tr className="itemCountsRow">
      <td><CountInput count={{name: "countIn", val: countIn}} onChange={handleCountInChange}/></td>
      <td><CountInput count={{name: "add", val: add}} onChange={handleAddChange}/></td>
      <td style={{color:'skyblue'}}> {totalIn} </td>
      <td><CountInput count={{name: "comp", val: comp}} onChange={handleCompChange}/></td>
      <td><CountInput count={{name: "countOut", val: countOut}} onChange={handleCountOutChange}/></td>
      <td style={{color:'skyblue'}}> {totalSold} </td>
      <td style={{color:'skyblue'}}> {gross.toFixed(2)} </td>
    </tr>
  )
}

function CountInput({ count, onChange }){
  return(
    <input className="countInput" type="number" id={count.name} name={count.name} defaultValue={count.val} onChange={onChange}/>
  )
}

function ItemTotalsRow({ merchId }){
  const { totals } = useContext(MerchItemContext)

  return(
    <tr>
      <td style={{border:"none"}}><MoreButton/></td>
      <td style={{border:"none"}}></td>
      <td style={{color:"skyblue", border:"none"}}>{totals.totalIn}</td>
      <td style={{color:"red", border:"none"}}>{totals.comp}</td>
      <td style={{border:"none"}}>{totals.countOut}</td>
      <td style={{color:"skyblue", border:"none"}}>{totals.totalSold}</td>
      <td style={{color:"skyblue", border:"none"}}>${totals.gross.toFixed(2)}</td>
    </tr>
  )

}

function MoreButton(){
  const { price, setPrice } = useContext(MerchItemContext)
  const [showPopUp, setShowPopUp] = useState(false)

  function handlePriceChange(e){
    setPrice(parseInt(e.target.value))
  }

  return(
    <div>
      <button className="moreButton" onClick={()=>{setShowPopUp(!showPopUp)}}> More </button>
      <div className="popup" style={{visibility: showPopUp ? 'visible' : 'hidden'}}>
        <form>
          <label for='price'> change price </label>
          <input type='number' id='price' name='price' onChange={handlePriceChange}></input>
        </form>
      </div>
    </div>
  )
}

function MerchItems({ items }){
  let rows = []

  for (const key in items){
    rows.push(
      <MerchItem 
        className="merchItem"
        merchItem={items[key]}
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

function Summary({onClick}){
  return(
    <div className='summary'>
      <button className="settleButton" onClick={onClick}> SETTLE </button>
    </div>
  )
}


function CountsPage() {
  const [hasSettled, setHasSettled] = useState(false)

  if(!hasSettled){
    return(
      <>
      <MerchItems items={MOCKITEMS}/>
      <Summary onClick={()=>{setHasSettled(true)}}/>
      </>
    )
  } else {
      return(
        <>
        <div className="disableDiv"></div>
        <MerchItems items={MOCKITEMS}/> 
        </>
      )
    }
}

function App() {
  return (
   <CountsPage/>
  );
}

export default App;
