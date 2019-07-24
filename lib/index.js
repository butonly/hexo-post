
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const yaml = require('js-yaml')

exports.g = function g(configFilePaths, hexoRepoPath, options) {
    options = options || {}

    const configFileContents = [
        path.join(configFilePaths, 'hexo.yaml')
    ].map((configFilePath) => fs.readFileSync(configFilePath, 'utf8'))
    
    const configs = yaml.safeLoadAll(configFileContents)
    
    configs.forEach((config) => {
        config.posts.forEach((post) => {
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
                    log(imageRegexpExec[0], ' -> ', `![${imageRegexpExec[1]}](${newImagePath})`)
                    content = content.replace(imageRegexpExec[0], `![${imageRegexpExec[1]}](${newImagePath})`)
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

            const dst = path.join(hexoRepoPath, `source/_posts/${postPath}`)

            if (fs.existsSync(dst) && fs.readFileSync(dst).toString().includes(content)) {
                log(`Content Not Changed: ${sourceFilePath}`)
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
        })
    })
    
    function log(...args) {
        if (options.verbose) {
            console.log(...args)
        }
    }
}
