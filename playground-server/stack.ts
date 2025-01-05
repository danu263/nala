import { Stack, StackProps, aws_ec2 as ec2 } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class PlaygroundServerStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'playground-vpc', {
      maxAzs: 2,
    });


    const securityGroup = new ec2.SecurityGroup(this, 'sg-playground', {
      vpc,
      allowAllOutbound: true,
    });

    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH access');

    new ec2.Instance(this, 'playground-instance', {
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE2, 
        ec2.InstanceSize.MICRO // free tier eligible
      ),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      vpc,
      securityGroup,
    });
  }
}
