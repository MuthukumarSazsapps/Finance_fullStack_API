import mssql from 'mssql';
import express from 'express';
import cors from 'cors';

const config = {
  user: 'Sazs_Finance_Dev',
  password: '$FinaceApp@762#1',
  port: 16289,
  server: 'mssql-71431-0.cloudclusters.net', // You can also use an IP address here
  database: 'Sazs_FinanceApp',
  options: {
    trustServerCertificate: true,
  },
};

const config1 = {
  user: 'TestLogin',
  password: 'password',
  port: 1433,
  server: 'localhost', // You can also use an IP address here
  database: 'sazs_finance',
  options: {
    trustServerCertificate: true,
  },
};

export const pool = new mssql.ConnectionPool(config);
export const transaction = new mssql.Transaction(pool);

const connectToDatabase = async () => {
  try {
    await pool.connect();
    console.log('Connected to the database.');
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
};

export default connectToDatabase;
