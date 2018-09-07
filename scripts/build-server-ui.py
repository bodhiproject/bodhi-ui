from subprocess import call

def buildEnv(env):
    cmd = 'build:%s' % env
    path = '/var/www/bodhi/' + env
    output = '-output=%s' % path

    print 'Building %s UI at %s' % (env, path)
    call(['sudo', 'npm run', cmd, output])

buildEnv('mainnet')
buildEnv('testnet')
buildEnv('regtest')
