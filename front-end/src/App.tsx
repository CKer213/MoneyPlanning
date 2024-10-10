import './App.css';
import React from 'react';
import {Button, TextField, MenuItem } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

//Import Data
import transactionService from './services/transactionService.ts';

interface Transaction {
  title: string;
  category: string;
  income: number;
  outcome: number;
  label: string; 
  value: number; 
}

function validate (input: string) {
  let x:boolean = true;
  if (input === ""){
      x = false;
  }
  return(x);
}

function App() {
  const [budgetAmount, setBudgetAmount] = React.useState<number>(0);
  const [totalIncome, setTotalIncome] = React.useState<number>(0);
  const [totalOutcome, setTotalOutcome] = React.useState<number>(0);
  const [transaction, setTransaction] = React.useState<Transaction>({
    title: "",
    category: "",
    income: 0,
    outcome: 0,
    label: "",
    value: 0
  });
  const [validation, setValidation] = React.useState<boolean>(true);
  const [list, setList] = React.useState<Transaction[]>([]);
  const [expandPie, setExpandPie] = React.useState<boolean>(false);
  const [expandForm, setExpandForm] = React.useState<boolean>(false);

  //Category set
  const categoryOption = [
    {
      value: "Food",
      label: "Food"
    },
    {
      value: "Housing",
      label: "Housing"
    },
    {
      value: "Transportation",
      label: "Transportation"
    },
    {
      value: "Groceries",
      label: "Groceries"
    },
    {
      value: "Entertainment",
      label: "Entertainment"
    },
    {
      value: "Others",
      label: "Others"
    },
  ]

  React.useEffect(()=> {
    async function getTransaction() {
      try {
        const allTransaction = await transactionService.getAllTransaction();
        setList(allTransaction);
      } catch (err) {
        console.error(err);
      }
    }
    function calculateTotal() {
      let income: number = 0;
      let outcome: number = 0;
      list.forEach((item) => {
        income += item.income;
        outcome += item.outcome;
      })
      setTotalIncome(income);
      setTotalOutcome(outcome);
    }

    getTransaction();
    calculateTotal();
  },[list])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    let {name, value} = event.target;
    setTransaction(prevValue => ({
      ...prevValue,
      [name]: value
    }))
  }
  
  //Convert type from String to Number
  function handleChangeNum(event: React.ChangeEvent<HTMLInputElement>) {
    let {name, value} = event.target;
    setTransaction(prevValue => ({
      ...prevValue,
      [name]: Number(value)
    }))
  }

  // Combined data with category for Pie chart
  const combinedData = list.reduce((acc: Array<{ label: string; value: number }>, curr) => {
    //Check if previous category appears
    const existing = acc.find((item) => item.label === curr.category);
    if (existing) {
      //Summing up total outcome for one category
      existing.value += curr.outcome;
    } else {
      acc.push({ label: curr.category, value: curr.outcome });
    }
    return acc;
  }, []);
   
  // Add Transaction History
  function addTransaction () {
    let titleCheck: boolean = validate(transaction.title);
    let categoryCheck: boolean  = validate(transaction.category);
    // To avoid blank input
    if (titleCheck && categoryCheck) {
      setExpandForm(false); 
      setValidation(true);
      transaction.label = transaction.category;
      transaction.value = transaction.outcome;
      transactionService.addTransaction(transaction);
    } else {
      setValidation(false);
    }
  }

  return (
    <div className="container">
      <div className="dashboard">
        <table className="dashboard-table">
          <tr className="dashboard-table-title"> 
            <th className="dashboard-table-event">Event</th>
            <th className="dashboard-table-category">Category</th>
            <th className="dashboard-table-income-outcome">Income</th>
            <th className="dashboard-table-income-outcome">Outcome</th>
          </tr>
          {
            list.map((eachList, index)=> {
              return(
                <tr className="dashboard-table-content" key={index}>
                  <td className="dashboard-table-event">{eachList.title}</td>
                  <td className="dashboard-table-category">{eachList.category}</td>
                  <td className="dashboard-table-income-outcome">{eachList.income}</td>
                  <td className="dashboard-table-income-outcome">{eachList.outcome}</td>
                </tr>
              )
            })
          }
        </table>
        <div className="balance">
          <div className="balance-text">Money left:</div>
          <div className="balance-amount">{budgetAmount-totalOutcome+totalIncome}</div>
        </div>
      </div>
      <div className="feature">
        <TextField label="Budget" variant="standard" type="number" onChange={(e)=> setBudgetAmount(Number(e.target.value))}/>
        <div className="feature-content">
          {
            expandPie ?
            <div className="feature-content justify-content-between">
              <div className="feature-content-pie-title">Outcome Pie Chart</div>
              <PieChart 
                series={[
                  {
                    data: combinedData,
                    highlightScope: { fade: 'global', highlight: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  }
                ]}
                width={400}
                height={200}
              />
              <Button variant="contained" onClick={()=>setExpandPie(false)}>Close Pie Chart</Button>
            </div>
            :
            <Button variant="contained" onClick={()=>setExpandPie(true)}>View Pie Chart</Button>
          }
        </div>
        <div className="feature-content">
          {
            expandForm &&
            <div className="feature-content-form">
              <TextField required name="title" value={transaction.title} label="Title" onChange={handleChange}/>
              <TextField 
                required 
                select
                margin="normal" 
                name="category" 
                value={transaction.category} 
                label="Category" 
                onChange={handleChange}>
                  {categoryOption.map((option)=>(
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
              </TextField>
              <TextField margin="normal" name="income"  value={transaction.income} label="Income" type="number" onChange={handleChangeNum}/>
              <TextField margin="normal" name="outcome" value={transaction.outcome} label="Outcome" type="number" onChange={handleChangeNum}/>
            </div>
          }
        </div>
        <div className="feature-content">
          {
            !expandForm ? 
            //Clear form data before showing
            <Button variant="contained" onClick={()=>{setExpandForm(true); setTransaction({title:"",category:"",income:0,outcome:0,label:"",value:0})}}>Add Transaction</Button>
            :
            <div className="feature-content-buttonbar">
              <Button variant="contained" color="success" onClick={()=>addTransaction()}>Add</Button>
              <Button variant="contained" onClick={()=>{setExpandForm(false); setValidation(true)}}>Cancel</Button>
            </div>
          }
          {
            !validation &&
            <div className="feature-content-warning">Please fill in all the details!</div>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
