import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

function dirResolver(path: string, ...paths: string[]): string {
	const fileName = fileURLToPath(path);
	console.log(fileName);
	return join(dirname(fileName), ...paths);
}

export default dirResolver;
