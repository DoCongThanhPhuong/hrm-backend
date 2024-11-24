import { DataSource } from 'typeorm';

import connectionOptions from './ormconfig';

const dataSource = new DataSource(connectionOptions);

export default dataSource;
