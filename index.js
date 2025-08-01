import jsonfile from 'jsonfile';
import moment from 'moment';
import simpleGit from 'simple-git';

const path = './data.json';
const date = moment().format();

const data = {
    date: date,
};

jsonfile.writeFile(path, data, (err) => {
    if (err) {
        console.error('Error writing file:', err);
    } else {
        const git = simpleGit();
        git.add('.') // ✅ add all changes
            .commit(date, { '--date': date })
            .push()
            .catch(err => console.error('Git push failed:', err));
    }
});
