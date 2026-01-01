import app from './app';
import { ENV } from './utils/env';

const PORT = ENV.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
