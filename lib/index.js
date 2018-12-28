
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

exports.g = function g(configFilePaths, hexoRepoPath, options) {
    options = options || {}
    const configFileContents = [path.join(configFilePaths, 'hexo.yaml')].map((configFilePath) => fs.readFileSync(configFilePath, 'utf8'))
    
    const configs = yaml.safeLoadAll(configFileContents)
    
    configs.forEach((config) => {
        config.posts.forEach((post) => {
            log(configFilePaths, post.path, path.join(configFilePaths, post.path))
            let content = fs.readFileSync(path.join(configFilePaths, post.path)).toString().replace(/#.*$/im, '')

            log()
            log(path.join(hexoRepoPath, `source/_posts/${post.title}.md`))
            
            let imageRegexpExec
            const imageRegexp = /!\[(.*)\]\((.*)\)/gim
            while (imageRegexpExec = imageRegexp.exec(content)) {
                const imageBaseUrl = post.imageBaseUrl || config.imageBaseUrl
                const newImagePath = (imageBaseUrl + imageRegexpExec[2]) || ''
                log(imageRegexpExec[0], ' -> ', `![${imageRegexpExec[1]}](${newImagePath})`)
                content = content.replace(imageRegexpExec[0], `![${imageRegexpExec[1]}](${newImagePath})`)
            }
    
            const tags = Array.isArray(post.tags) ? post.tags : (post.tags || '').split(' ')
            const categories = Array.isArray(post.categories) ? post.categories : (post.categories || '未分类').split(' ')
    
            content = `---\ntitle: ${post.title}\ndate: ${post.date}\nupdated: ${new Date()}\ntags:\n${toList(tags)}\ncategories:\n${toList(categories)}\n---\n\n` + content
     
            const dst = path.join(hexoRepoPath, `source/_posts/${post.title}.md`)
            fs.writeFileSync(dst, content, {encoding: 'utf8'})
        })
    })
    
    function toList(array) {
        if (!Array.isArray(array)) {
            return [].join('\n')
        }
        array.forEach((item, i) => {array[i] = '- ' + array[i]})
        return array.join('\n')
    }

    function log() {
        if (options.verbose) {
            console.log.apply(null, Array.prototype.slice.call(arguments))
        }
    }
}
