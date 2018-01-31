import clearDb from '../../app/utils/clearDb';
import seed from '../../app/utils/seed';

export default async function setup(done) {
  try {
    await clearDb();
    await seed();
    done();
  } catch(e) {
    console.log('error: ', e);
  }
}
