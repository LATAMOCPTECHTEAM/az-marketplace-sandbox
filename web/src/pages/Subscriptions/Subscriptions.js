import React from 'react';
import ReactDataGrid from 'react-data-grid';


function Subscriptions() {
    const columns = [
        { key: "id", name: "ID", editable: true },
        { key: "title", name: "Title", editable: true },
        { key: "complete", name: "Complete", editable: true }
      ];
      
      const rows = [
        { id: 0, title: "Task 1", complete: 20 },
        { id: 1, title: "Task 2", complete: 40 },
        { id: 2, title: "Task 3", complete: 60 }
      ];
    return (
        
            <ReactDataGrid
                columns={columns}
                rows={rows}
                rowsCount={rows.length}/>
       
    );
}

export default Subscriptions;