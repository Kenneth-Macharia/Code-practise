# Generated by Django 2.2.1 on 2019-08-23 15:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cbvs_app', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='school',
            old_name='loacation',
            new_name='location',
        ),
    ]
