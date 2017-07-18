/*
 * Copyright (c) 2016 Financial Spectra
 * All rights reserved.
 * 
 * Class Name   - DataTable
 *
 * Description  - Structure to store columns and rows of a data table
 *
 * Developer(s) - SSingh
 */
global class DataTable {
    @AuraEnabled global Field[] columns;
    @AuraEnabled global Row[] rows;
}