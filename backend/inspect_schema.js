require('dotenv').config();
const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: false, // For somee.com
        trustServerCertificate: true,
    },
};

async function inspectSchema() {
    try {
        await sql.connect(config);
        console.log('Connected to database');

        const result = await sql.query`
      SELECT 
        t.name AS TableName,
        c.name AS ColumnName,
        ty.name AS DataType,
        c.max_length AS MaxLength,
        c.is_nullable AS IsNullable
      FROM 
        sys.tables t
      INNER JOIN 
        sys.columns c ON t.object_id = c.object_id
      INNER JOIN 
        sys.types ty ON c.user_type_id = ty.user_type_id
      ORDER BY 
        t.name, c.column_id;
    `;

        const tables = {};
        result.recordset.forEach(row => {
            if (!tables[row.TableName]) {
                tables[row.TableName] = [];
            }
            tables[row.TableName].push({
                column: row.ColumnName,
                type: row.DataType,
                nullable: row.IsNullable
            });
        });

        const fs = require('fs');
        fs.writeFileSync('schema.json', JSON.stringify(tables, null, 2));
        console.log('Schema saved to schema.json');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sql.close();
    }
}

inspectSchema();
