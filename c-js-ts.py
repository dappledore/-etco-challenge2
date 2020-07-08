# convets js files to typescript files
from os import listdir, system
from os.path import isdir, join

# Source: react-js-to-ts - https://www.npmjs.com/package/react-js-to-ts
# Source: js-to-ts-converter - https://www.npmjs.com/package/js-to-ts-converter


def get_filepaths(folder_path):
    filepaths = []
    for filepath in listdir(folder_path):
        complete_path = join(folder_path, filepath)
        if isdir(complete_path):
            filepaths.extend(get_filepaths(complete_path))
        else:
            filepaths.append(complete_path)
    return filepaths


def run_react_js_to_ts_conversion_on(folder_path):
    '''
        Uses react-js-to-ts npm package to convert all files in a directory from js to tsx.
        NOTE: react-js-to-ts must be installed globally. `npm i -g react-js-to-ts`
    '''
    filepaths = get_filepaths(folder_path)
    for filepath in filepaths:
        print('converting {} to typescript').format(filepath)
        system('react-js-to-ts {}'.format(filepath))


if __name__ == '__main__':
    run_react_js_to_ts_conversion_on('./src/screens')
    run_react_js_to_ts_conversion_on('./src/components')
    system('npx js-to-ts-converter ./src/*')
