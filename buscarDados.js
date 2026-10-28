const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const queryOracle = `
  SELECT * 
  FROM AFSESAB.VW_SIGAF_REL_DISTRIBUICAO_D1 vsrdd1
  WHERE DATA_DISTRIBUICAO >= TIMESTAMP '2025-01-01 00:00:00.000000'
    AND PROGRAMA IN (
      'TOXOPLASMOSE', 'PROGRAMA DST/AIDS', 'ENDEMIAS', 'TUBERCULOSE', 
      'HEPATITES VIRAIS', 'ANEMIA FALCIFORME', 'BRUCELOSE', 'COQUELUCHE', 
      'COVID 19', 'DOENÇA DE CHAGAS - MS', 'HIDRADENITE SUPURATIVA', 
      'INFLUENZA - MS', 'LEISHMANIOSE - MS', 'PROGRAMA TABAGISMO', 
      'HANSENÍASE', 'FEBRE MACULOSA', 'MALÁRIA - MS', 'MENINGITE - MS', 'SÍFILIS'
    )
`;

async function obterDados() {
  let connection;

  // SIMULAÇÃO ATIVA PARA O CODESPACES (Ignora o IP interno 10.17.1.30 provisoriamente)
  if (process.env.NODE_ENV === 'test' || !process.env.ORACLE_PASSWORD) {
    return [
      { PROGRAMA: 'COVID 19', QUANTIDADE: 1540, STATUS: 'DISTRIBUIDO' },
      { PROGRAMA: 'TUBERCULOSE', QUANTIDADE: 420, STATUS: 'EM ANDAMENTO' },
      { PROGRAMA: 'SÍFILIS', QUANTIDADE: 890, STATUS: 'DISTRIBUIDO' },
      { PROGRAMA: 'HANSENÍASE', QUANTIDADE: 230, STATUS: 'RETIDO' }
    ];
  }

  try {
    connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: "10.17.1.30:1521/pdbprod01.ses.ba"
    });

    const result = await connection.execute(queryOracle);
    return result.rows;
  } catch (err) {
    console.error("Erro na conexão real do Oracle:", err.message);
    throw err;
  } finally {
    if (connection) { await connection.close(); }
  }
}

module.exports = { obterDados };
