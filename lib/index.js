
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const yaml = require('js-yaml')

exports.g = function g(configFilePaths, hexoRepoPath, options) {
    function log(...args) {
        if (options.verbose) {
            console.log(...args)
        }
    }
    
    options = options || {}

    const configFileContents = [
        path.join(configFilePaths, 'hexo.yaml')
    ].map((configFilePath) => fs.readFileSync(configFilePath, 'utf8'))
    
    const configs = yaml.safeLoadAll(configFileContents)
    
    const hexoPostDir = path.join(hexoRepoPath, `source/_posts`)
    const articleFiles = []
    configs.forEach((config) => {
        config.posts.forEach((post) => {
            if (post.show === false) {
                return
            }

            const sourceFilePath = path.join(configFilePaths, post.path)
            
            log(`Process: ${sourceFilePath}`)
            
            let content = fs.readFileSync(sourceFilePath).toString().replace(/#.*$/im, '')

            let imageRegexpExec
            const imageRegexp = /!\[(.*)\]\((.*)\)/gim
            while (imageRegexpExec = imageRegexp.exec(content)) {
                const imagePath = imageRegexpExec[2]
                if (imagePath && !(imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
                    if (!post.imageBaseUrl) {
                        post.imageBaseUrl = config.repository
                    }
                    if (!post.imageBaseUrl.endsWith('/')) {
                        post.imageBaseUrl += '/'
                    }
                    post.imageBaseUrl = post.imageBaseUrl.replace('github.com', 'raw.githubusercontent.com')
                    const newImagePath = post.imageBaseUrl + 'master/' + path.dirname(post.path) + '/' + imageRegexpExec[2]
                    const from = imageRegexpExec[0]
                    const to = `![${imageRegexpExec[1]}](${newImagePath})`
                    log('\tReplace Image Url:', from, '->', to)
                    content = content.replace(from, to)
                }
            }

            const postPath = (() => {
                if (config.PATH_MODE === 'TREE') {
                    return post.path
                }
                else if (config.PATH_MODE === 'TILED') {
                    return path.basename(post.path)
                }
                else {
                    return post.path
                }
            })()

            const dst = path.join(hexoPostDir, postPath)
            articleFiles.push(dst)

            if (fs.existsSync(dst) && fs.readFileSync(dst).toString().includes(content)) {
                log(`\tContent Not Changed: ${sourceFilePath}\n`)
                return
            }
    
            const tags = Array.isArray(post.tags) ? post.tags : (post.tags || '').split(' ')
            const categories = Array.isArray(post.categories) ? post.categories : (post.categories || '未分类').split(' ')
    
            const footer = config.repository ? `<a href="${config.repository}/tree/master/${post.path}" >查看源文件</a>&nbsp;&nbsp;<a href="${config.repository}/edit/master/${post.path}">编辑源文件</a>` : ''

            content = ''
                + '---\n' 
                + `title: ${post.title}\n`
                + `date: ${new Date(post.date).toISOString()}\n`
                + `updated: ${new Date().toISOString()}\n`
                + `tags: [${tags.toString()}]\n`
                + `categories: [${categories.toString()}]\n`
                + `---`
                + `\n\n`
                + content
                + `\n\n`
                + `---`
                + `\n\n`
                + footer
                + `\n`
            
            mkdirp.sync(path.dirname(dst))
            fs.writeFileSync(dst, content, {encoding: 'utf8'})
            log()
        })
    })

    arrayDiff(ls(hexoPostDir), articleFiles).forEach((file) => {
        log(`Unlink: ${file}`)
        fs.unlinkSync(file)
    })
}

function travel(dir, callback) {
    fs.readdirSync(dir).forEach((fileName) => {
        const fullPath = path.join(dir, fileName)

        if (fs.statSync(fullPath).isDirectory()) {
            travel(fullPath, callback)
        } else {
            callback(fullPath)
        }
    })
}

function ls(dir) {
    const files = []
    travel(dir, (file) => files.push(file))
    return files
}

function arrayDiff(a, ...values) {
	const set = new Set([].concat(...values))
	return a.filter(element => !set.has(element))
}
